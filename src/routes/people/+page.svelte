<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>
<h1>sup jamal</h1>

<!-- src/routes/people/+page.svelte -->
<script lang="ts">
  import Timeline from '$lib/components/Timeline.svelte';
  import people from '$lib/data/people.json';
</script>

<h1>People Timeline</h1>
<Timeline items={people} />

<nav class="mt-8">
  <a class="btn" href="/books">📚 See books timeline</a>
</nav>
