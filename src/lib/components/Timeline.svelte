<script lang="ts">
  export let items: {
    id: string;
    name: string;
    born?: number;
    died?: number;
    published?: number;   // for books
    image: string;
    gender: number;
  }[];

  // Sort ascending by whichever date field exists
  $: sorted = [...items].sort(
    (a, b) => (a.born ?? a.published) - (b.born ?? b.published)
  );
</script>

<style>
  .timeline {
    display: flex;
    gap: 2rem;
    overflow-x: auto;
    padding-block: 1rem;
    scroll-snap-type: x mandatory;
  }
  .card {
    flex: 0 0 260px;
    scroll-snap-align: start;
    border-radius: 1rem;
    background: var(--card-bg, #fff);
    box-shadow: 0 2px 8px rgba(0,0,0,.08);
  }
  .card img { width: 100%; height: 320px; object-fit: cover; }
  @media (max-width: 640px) { .card { flex-basis: 80vw; } }
</style>

<div class="timeline">
  {#each sorted as p}
    <article class="card">
      <img src={p.image} alt={"Portrait of " + (p.name || p.title)} loading="lazy" />
      <div class="p-4">
        <h3 class="text-lg font-semibold">{p.name || p.title}</h3>
        <p class="text-sm opacity-70">
          {#if p.born}{p.born} – {p.died ?? "…"}{/if}
          {#if p.published}{p.published}{/if}
        </p>
        <p class="mt-2 text-sm">{p.blurb}</p>
      </div>
    </article>
  {/each}
</div>
