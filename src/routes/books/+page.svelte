<!-- src/routes/books/+page.svelte -->
<script lang="ts">
  import TimelineChart from '$lib/components/TimelineChart.svelte';
  import books from '$lib/data/books.json';
  import { base } from '$app/paths';
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
  
  .navigation-icon {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 100;
    background-color: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    font-size: 24px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    transition: transform 0.2s, background-color 0.2s;
  }
  
  .navigation-icon:hover {
    transform: scale(1.1);
    background-color: rgba(0, 0, 0, 0.8);
  }
</style>

<div class="timeline-wrapper">
  <TimelineChart items={books} />
</div>

<a href="{base}/people" class="navigation-icon" title="Go to People Timeline">👤</a>
