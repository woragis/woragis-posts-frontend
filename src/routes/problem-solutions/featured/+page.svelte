<script lang="ts">
	import { onMount } from 'svelte';
	import { loadFeaturedProblemSolutions, problemSolutions } from '$lib/stores/problem-solutions';
	import { ProblemSolutionView } from '$lib/components/problem-solutions';

	let currentIndex = 0;

	onMount(async () => {
		await loadFeaturedProblemSolutions();
	});

	function handleNext() {
		if (currentIndex < $problemSolutions.featuredItems.length - 1) {
			currentIndex++;
		}
	}

	function handlePrev() {
		if (currentIndex > 0) {
			currentIndex--;
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="mb-8">
				<h1 class="text-4xl font-bold text-gray-900 mb-2">Featured Problem Solutions</h1>
				<p class="text-gray-600">Handpicked technical solutions showcasing expertise and impact</p>
			</div>

			{#if $problemSolutions.isLoadingFeatured}
				<div class="text-center py-12">
					<p class="text-gray-500">Loading featured solutions...</p>
				</div>
			{:else if $problemSolutions.featuredItems.length === 0}
				<div class="text-center py-12 bg-white rounded-lg shadow">
					<p class="text-gray-500">No featured problem solutions yet</p>
				</div>
			{:else}
				<div class="space-y-8">
					<!-- Featured Gallery -->
					<div class="bg-white rounded-lg shadow">
						<div class="px-6 py-4 border-b border-gray-200">
							<p class="text-sm text-gray-600">
								Showing {currentIndex + 1} of {$problemSolutions.featuredItems.length}
							</p>
						</div>
						<ProblemSolutionView
							problemSolution={$problemSolutions.featuredItems[currentIndex]}
							isLoading={false}
						/>
					</div>

					<!-- Navigation -->
					{#if $problemSolutions.featuredItems.length > 1}
						<div class="flex justify-center gap-4">
							<button
								on:click={handlePrev}
								disabled={currentIndex === 0}
								class="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
							>
								← Previous
							</button>
							<button
								on:click={handleNext}
								disabled={currentIndex >= $problemSolutions.featuredItems.length - 1}
								class="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
							>
								Next →
							</button>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>
