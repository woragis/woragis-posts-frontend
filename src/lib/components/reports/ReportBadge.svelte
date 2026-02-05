<script lang="ts">
	export let name: string = '';
	export let isFavorite: boolean = false;
</script>

<span
	class="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
>
	{#if isFavorite}
		<span>⭐</span>
	{/if}
	<span>📊</span>
	{name}
</span>
