<script lang="ts">
	import { onMount } from 'svelte';
	import { technicalWritings } from '$lib/stores/technical-writings';
	import { TechnicalWritingView } from '$lib/components/technical-writings';

	let currentIndex = 0;

	onMount(async () => {
		await technicalWritings.loadFeatured();
	});

	function goToPrevious() {
		if (currentIndex > 0) currentIndex--;
	}

	function goToNext() {
		if (currentIndex < $technicalWritings.featuredItems.length - 1) currentIndex++;
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<h1 class="mb-8 text-3xl font-bold text-gray-900">Featured Writings</h1>

			{#if $technicalWritings.isLoadingFeatured}
				<div class="py-12 text-center">
					<p class="text-gray-500">Loading...</p>
				</div>
			{:else if $technicalWritings.featuredItems.length > 0}
				<div class="space-y-6">
					<!-- Carousel -->
					<div class="rounded-lg bg-white p-8 shadow">
						<TechnicalWritingView writing={$technicalWritings.featuredItems[currentIndex]} />
					</div>

					<!-- Navigation -->
					<div class="flex items-center justify-between">
						<button
							on:click={goToPrevious}
							disabled={currentIndex === 0}
							class="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
						>
							← Previous
						</button>

						<div class="text-center">
							<p class="text-gray-600">
								<strong>{currentIndex + 1}</strong> of
								<strong>{$technicalWritings.featuredItems.length}</strong>
							</p>
						</div>

						<button
							on:click={goToNext}
							disabled={currentIndex === $technicalWritings.featuredItems.length - 1}
							class="rounded-md bg-gray-200 px-4 py-2 font-medium text-gray-900 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
						>
							Next →
						</button>
					</div>
				</div>
			{:else}
				<div class="rounded-lg bg-white py-12 text-center shadow">
					<p class="text-gray-500">No featured writings yet</p>
				</div>
			{/if}
		</div>
	</div>
</div>
