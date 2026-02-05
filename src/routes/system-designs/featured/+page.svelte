<script lang="ts">
	import { onMount } from 'svelte';
	import { systemDesigns } from '$lib/stores/system-designs';

	let currentPage = 0;

	onMount(async () => {
		await systemDesigns.loadFeatured();
	});

	function nextDesign() {
		if (currentPage < $systemDesigns.featuredItems.length - 1) {
			currentPage++;
		}
	}

	function prevDesign() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	$: currentDesign = $systemDesigns.featuredItems[currentPage];
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
		<h1 class="mb-8 text-3xl font-bold text-gray-900">Featured System Designs</h1>

		{#if $systemDesigns.featuredItems.length > 0 && currentDesign}
			<div class="space-y-4">
				<div class="rounded-lg bg-white p-8 shadow-lg">
					<h2 class="mb-2 text-2xl font-bold text-gray-900">{currentDesign.title}</h2>
					<p class="mb-4 text-gray-600">{currentDesign.description}</p>

					<div class="grid gap-4 md:grid-cols-2">
						<div class="rounded-lg bg-gray-50 p-4">
							<h3 class="font-semibold text-gray-900">Data Flow</h3>
							<p class="mt-2 text-sm text-gray-600">
								{currentDesign.dataFlow.substring(0, 150)}...
							</p>
						</div>
						<div class="rounded-lg bg-gray-50 p-4">
							<h3 class="font-semibold text-gray-900">Scalability</h3>
							<p class="mt-2 text-sm text-gray-600">
								{currentDesign.scalability.substring(0, 150)}...
							</p>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<button
						on:click={prevDesign}
						disabled={currentPage === 0}
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					>
						← Previous
					</button>
					<span class="text-gray-600">
						{currentPage + 1} of {$systemDesigns.featuredItems.length}
					</span>
					<button
						on:click={nextDesign}
						disabled={currentPage === $systemDesigns.featuredItems.length - 1}
						class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
					>
						Next →
					</button>
				</div>
			</div>
		{:else}
			<div class="rounded-lg bg-white p-8 text-center shadow">
				<p class="text-gray-500">No featured system designs yet</p>
			</div>
		{/if}
	</div>
</div>
