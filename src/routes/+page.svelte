<!-- src/routes/+page.svelte -->
<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { base } from '$app/paths';
  
  onMount(() => {
    goto(`${base}/people`);
  });
</script>

<div>Redirecting to people page...</div> 