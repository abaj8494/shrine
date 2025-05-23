<script lang="ts">
  import { resolveBasePath } from '$lib/utils/paths';
  import { onMount } from 'svelte';
  
  export let items: {
    id: string;
    name: string;
    born?: number;
    died?: number;
    published?: number;   // for books
    image: string;
    gender: number;
  }[];

  // Constants for visualization
  const PADDING = 60;
  const TIMELINE_Y = 800; // Increased from 400 to shift the timeline lower
  const BAR_HEIGHT = 8; // Thinner bars
  const BAR_GAP = 40; // Increased gap between bars (was 25)
  const BAR_OFFSET = 90; // Distance between bars and main timeline (was 70)
  const NAME_OFFSET = 10; // Distance between bar and name (reduced from 20)
  const DATE_OFFSET = 36; // Distance between bar and date (was not explicitly defined)
  const YEAR_PIXEL_RATIO = 1.2; // pixels per year - significantly increased for more horizontal space
  const MAX_BARS_PER_SIDE = 25; // Increased from 20 to allow more rows
  
  // Calculate the earliest and latest years in the dataset
  $: earliestYear = Math.floor(Math.min(...items.map(p => p.born || p.published || 0)) / 100) * 100 - 100;
  $: latestYear = Math.ceil(Math.max(...items.map(p => p.died || new Date().getFullYear() || 0)) / 100) * 100;
  
  // Calculate total width based on year span
  $: width = (latestYear - earliestYear) * YEAR_PIXEL_RATIO + (PADDING * 2);
  
  // Calculate total height with additional padding
  $: height = TIMELINE_Y + (PADDING * 3) + (MAX_BARS_PER_SIDE * 2) * (BAR_HEIGHT + BAR_GAP);
  
  // Sort by birth year
  $: sorted = [...items].sort((a, b) => 
    (a.born || a.published || 0) - (b.born || b.published || 0)
  );
  
  // Function to convert year to x position
  function yearToX(year: number): number {
    return ((year - earliestYear) * YEAR_PIXEL_RATIO) + PADDING;
  }
  
  // Generate major time markers (centuries)
  $: timeMarkers = Array.from(
    { length: Math.ceil((latestYear - earliestYear) / 100) + 1 },
    (_, i) => Math.floor(earliestYear / 100) * 100 + (i * 100)
  );
  
  // Format year with BC/AD
  function formatYear(year: number): string {
    if (year === 0) return "0";
    return year < 0 ? `${Math.abs(year)}BC` : `${year}`;
  }
  
  // Distribute bars with guaranteed no overlap
  $: {
    // Group people by which side of the timeline they'll appear on
    const topPeople = [];
    const bottomPeople = [];
    
    // Assign people to top or bottom based on alternating pattern
    for (let i = 0; i < sorted.length; i++) {
      if (i % 2 === 0) {
        topPeople.push(sorted[i]);
        sorted[i].placement = 'top';
      } else {
        bottomPeople.push(sorted[i]);
        sorted[i].placement = 'bottom';
      }
    }
    
    // Function to sort people by row assignment
    function assignRows(peopleList) {
      // Sort by birth year first
      peopleList.sort((a, b) => 
        (a.born || a.published || 0) - (b.born || b.published || 0)
      );
      
      // For each person, find the first available row that doesn't overlap
      for (let i = 0; i < peopleList.length; i++) {
        const person = peopleList[i];
        const personStart = person.born || person.published || 0;
        const personEnd = person.died || new Date().getFullYear();
        
        // Start checking from row 1
        let rowAssigned = false;
        let currentRow = 1;
        
        while (!rowAssigned && currentRow <= MAX_BARS_PER_SIDE) {
          // Check if this row has any overlapping people
          const hasOverlap = peopleList.some((p, idx) => {
            if (idx >= i || p.row !== currentRow) return false; // Only check people already assigned to this row
            
            const pStart = p.born || p.published || 0;
            const pEnd = p.died || new Date().getFullYear();
            
            // Check for overlap with increased buffer for extra spacing
            return (personStart <= pEnd + 70) && (personEnd >= pStart - 70); // Increased buffer (was 50)
          });
          
          if (!hasOverlap) {
            person.row = currentRow;
            rowAssigned = true;
          } else {
            currentRow++;
          }
        }
        
        // If we couldn't find a non-overlapping row, just use the highest one
        if (!rowAssigned) {
          person.row = MAX_BARS_PER_SIDE;
        }
      }
    }
    
    // Assign rows to both groups
    assignRows(topPeople);
    assignRows(bottomPeople);
  }
  
  let selectedPerson = null;
  let tooltipX = 0;
  let tooltipY = 0;
  
  // Initialize when mounted
  onMount(() => {
    const container = document.querySelector('.timeline-container');
    if (container) {
      // Initial scroll position to show a relevant part of the timeline
      const initialScrollX = yearToX(Math.max(-500, earliestYear));
      container.scrollLeft = initialScrollX;
    }
  });
</script>

<style>
  .timeline-container {
    width: 100%;
    height: 100vh;
    background-color: #1C1E21;
    position: relative;
    overflow: auto; /* Enable standard scrolling */
  }
  
  .timeline-content {
    position: relative;
    min-width: 100%;
    width: max-content;
  }
  
  svg {
    display: block;
  }
  
  .time-marker {
    fill: #999;
    font-size: 12px;
  }
  
  .time-marker-line {
    stroke: #333;
    stroke-width: 1;
    stroke-dasharray: 2 4;
  }
  
  .main-timeline {
    stroke: #555;
    stroke-width: 3;
  }
  
  .person-name {
    fill: #fff;
    font-size: 11px;
    dominant-baseline: middle;
    pointer-events: all;
    cursor: pointer;
  }
  
  .person-name:hover {
    fill: #FA6742;
  }
  
  .person-bar {
    fill: #FA6742;
    rx: 2;
    ry: 2;
    opacity: 0.75;
    transition: opacity 0.2s;
    pointer-events: all;
    cursor: pointer;
  }
  
  .person-bar:hover {
    opacity: 1;
  }
  
  .date-label {
    fill: #aaa;
    font-size: 9px;
    pointer-events: none;
  }
  
  .image-popup {
    position: fixed;
    background-color: #23272F;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.5);
    z-index: 100;
    border: 1px solid #333;
    max-width: 200px;
    transform: translate(-50%, -50%);
  }
  
  .image-popup img {
    width: 100%;
    max-height: 250px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .image-popup h4 {
    margin: 8px 0 4px;
    color: #fff;
    text-align: center;
  }
  
  .image-popup p {
    margin: 0;
    font-size: 12px;
    color: #aaa;
    text-align: center;
  }
</style>

<div class="timeline-container">
  <div class="timeline-content" style="width: {width}px; height: {height}px;">
    <svg width={width} height={height}>
      <!-- Background -->
      <rect x="0" y="0" width={width} height={height} fill="#17191C" />
      
      <!-- Time markers -->
      {#each timeMarkers as year}
        <line 
          x1={yearToX(year)} 
          y1={0} 
          x2={yearToX(year)} 
          y2={height} 
          class="time-marker-line" 
        />
        <text 
          x={yearToX(year)} 
          y={TIMELINE_Y - 20} 
          text-anchor="middle" 
          class="time-marker"
        >
          {formatYear(year)}
        </text>
      {/each}
      
      <!-- Main timeline -->
      <line 
        x1={PADDING} 
        y1={TIMELINE_Y} 
        x2={width - PADDING} 
        y2={TIMELINE_Y} 
        class="main-timeline" 
      />
      
      <!-- Person timelines -->
      {#each sorted as person, index}
        <!-- Calculate positions -->
        {@const birthYear = person.born || person.published || 0}
        {@const deathYear = person.died || new Date().getFullYear()}
        {@const xStart = yearToX(birthYear)}
        {@const xEnd = yearToX(deathYear)}
        {@const barWidth = Math.max(xEnd - xStart, 5)} <!-- Ensure minimum visibility -->
        
        <!-- Calculate Y position based on placement and row -->
        {@const isTop = person.placement === 'top'}
        {@const rowOffset = (person.row - 1) * (BAR_HEIGHT + BAR_GAP)}
        {@const yPos = isTop 
          ? TIMELINE_Y - BAR_OFFSET - rowOffset - BAR_HEIGHT
          : TIMELINE_Y + BAR_OFFSET + rowOffset}
        
        <!-- Person bar group with pointer events -->
        <g 
          on:click={(e) => {
            selectedPerson = person;
            tooltipX = e.clientX;
            tooltipY = e.clientY;
            e.stopPropagation();
          }}
        >
          <!-- Person name -->
          <text 
            x={xStart + barWidth/2} 
            y={yPos + (isTop ? -NAME_OFFSET : BAR_HEIGHT + NAME_OFFSET)} 
            text-anchor="middle" 
            class="person-name"
          >
            {person.name}
          </text>
          
          <!-- Person lifespan bar -->
          <rect 
            x={xStart} 
            y={yPos} 
            width={barWidth} 
            height={BAR_HEIGHT} 
            class="person-bar"
          />
          
          <!-- Connecting line to timeline -->
          <line 
            x1={xStart + barWidth/2} 
            y1={yPos + (isTop ? BAR_HEIGHT : 0)} 
            x2={xStart + barWidth/2} 
            y2={TIMELINE_Y + (isTop ? -3 : 3)} 
            stroke="#555" 
            stroke-width="0.5" 
            stroke-dasharray="2 2" 
          />
        </g>
      {/each}
    </svg>
  </div>
  
  {#if selectedPerson}
    <div 
      class="image-popup" 
      style="left: {tooltipX}px; top: {tooltipY}px;"
    >
      <img src={resolveBasePath(selectedPerson.image)} alt={selectedPerson.name} />
      <h4>{selectedPerson.name}</h4>
      <p>
        {selectedPerson.born ? formatYear(selectedPerson.born) : ''} - 
        {selectedPerson.died ? formatYear(selectedPerson.died) : 'present'}
        ({selectedPerson.died 
          ? Math.abs(selectedPerson.died - selectedPerson.born) 
          : Math.abs(new Date().getFullYear() - selectedPerson.born)} years)
      </p>
      <button 
        style="position: absolute; top: 5px; right: 5px; background: none; border: none; color: white; cursor: pointer; font-size: 16px;"
        on:click={() => selectedPerson = null}
      >
        ×
      </button>
    </div>
  {/if}
</div> 