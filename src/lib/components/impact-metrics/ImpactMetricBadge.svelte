<script lang="ts">
	export let type: string = '';
	export let value: number = 0;
	export let unit: string = '';
	export let featured: boolean = false;
</script>

<span
	class="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
>
	{#if featured}
		<span>⭐</span>
	{/if}
	<span>📊</span>
	<strong>{value}</strong>
	<span class="text-xs">{unit}</span>
</span>
