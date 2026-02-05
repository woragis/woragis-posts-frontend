<script lang="ts">
	import { onMount } from 'svelte';
	import { systemDesigns } from '$lib/stores/system-designs';
	import { SystemDesignsList } from '$lib/components/system-designs';

	onMount(async () => {
		await systemDesigns.loadSystemDesigns();
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<SystemDesignsList />
		</div>
	</div>
</div>
