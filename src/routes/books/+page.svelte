<!-- src/routes/books/+page.svelte -->
<script lang="ts">
  import Timeline from '$lib/components/Timeline.svelte';
  import books from '$lib/data/books.json';
</script>

<h1>Books Timeline</h1>
<Timeline items={books} />

<nav class="mt-8">
  <a class="btn" href="/people">👥 people timeline</a>
</nav>
