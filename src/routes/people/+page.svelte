<!-- src/routes/people/+page.svelte -->
<script lang="ts">
  import TimelineChart from '$lib/components/TimelineChart.svelte';
  import people from '$lib/data/people.json';
</script>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    overflow: hidden;
    height: 100vh;
    width: 100vw;
    background-color: #1C1E21;
  }
  
  :global(html) {
    overflow: hidden;
  }
  
  .timeline-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
</style>

<div class="timeline-wrapper">
  <TimelineChart items={people} />
</div>