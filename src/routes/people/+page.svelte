<!-- src/routes/people/+page.svelte -->
<script lang="ts">
  import Timeline from '$lib/components/Timeline.svelte';
  import people from '$lib/data/people.json';
</script>

<h1>People Timeline</h1>
<Timeline items={people} />

<nav class="mt-8">
  <a class="btn" href="/books">📚 books timeline</a>
</nav>

<p><a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a></p>