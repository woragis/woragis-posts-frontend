<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { systemDesigns } from '$lib/stores/system-designs';
	import { SystemDesignView } from '$lib/components/system-designs';

	onMount(async () => {
		const id = $page.params.id;
		if (id) {
			await systemDesigns.loadPublic(id);
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			{#if $systemDesigns.currentSystemDesign}
				<SystemDesignView design={$systemDesigns.currentSystemDesign} />
			{:else}
				<div class="rounded-lg bg-white p-6 text-center shadow">
					<p class="text-gray-500">System design not found</p>
				</div>
			{/if}
		</div>
	</div>
</div>
