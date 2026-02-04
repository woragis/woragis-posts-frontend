<script lang="ts">
	import type { ProblemSolution } from '$lib/api/types';

	export let problemSolution: ProblemSolution | null = null;
	export let isLoading = false;
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="max-w-3xl mx-auto px-4">
		{#if isLoading}
			<div class="text-center">
				<p class="text-gray-500">Loading problem solution...</p>
			</div>
		{:else if !problemSolution}
			<div class="text-center">
				<p class="text-gray-500">Problem solution not found</p>
			</div>
		{:else}
			<article class="bg-white rounded-lg shadow-lg overflow-hidden">
				<!-- Header with Featured Badge -->
				<div class="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-8 text-white">
					<div class="flex items-start justify-between mb-4">
						<h1 class="text-4xl font-bold">{problemSolution.problem}</h1>
						{#if problemSolution.featured}
							<span class="inline-flex items-center gap-1 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full font-semibold">
								★ Featured
							</span>
						{/if}
					</div>
					<p class="text-blue-100 text-sm">
						Published on {new Date(problemSolution.createdAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</p>
				</div>

				<div class="px-8 py-8 space-y-8">
					<!-- Context Section -->
					<section>
						<h2 class="text-2xl font-bold text-gray-900 mb-4">Context</h2>
						<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{problemSolution.context}</p>
					</section>

					<!-- Solution Section -->
					<section class="border-t pt-8">
						<h2 class="text-2xl font-bold text-gray-900 mb-4">Solution</h2>
						<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{problemSolution.solution}</p>
					</section>

					<!-- Technologies Section -->
					{#if problemSolution.technologies.length > 0}
						<section class="border-t pt-8">
							<h2 class="text-2xl font-bold text-gray-900 mb-4">Technologies Used</h2>
							<div class="flex flex-wrap gap-2">
								{#each problemSolution.technologies as tech}
									<span class="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-medium">
										{tech}
									</span>
								{/each}
							</div>
						</section>
					{/if}

					<!-- Impact Section -->
					<section class="border-t pt-8">
						<h2 class="text-2xl font-bold text-gray-900 mb-4">Impact</h2>
						<p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{problemSolution.impact}</p>
					</section>

					<!-- Metrics Visualization -->
					{#if problemSolution.metrics}
						<section class="border-t pt-8">
							<h2 class="text-2xl font-bold text-gray-900 mb-6">Quantified Impact</h2>
							<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
								<!-- Before Metric -->
								<div class="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-lg border-2 border-red-200">
									<h3 class="text-sm font-semibold text-red-700 uppercase tracking-wide mb-2">Before</h3>
									<p class="text-2xl font-bold text-red-900">{problemSolution.metrics.before}</p>
								</div>

								<!-- Arrow/Direction -->
								<div class="flex items-center justify-center">
									<div class="text-center">
										<div class="text-4xl font-bold text-gray-400 mb-2">→</div>
										<p class="text-xs text-gray-500">improvement</p>
									</div>
								</div>

								<!-- After Metric -->
								<div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border-2 border-green-200">
									<h3 class="text-sm font-semibold text-green-700 uppercase tracking-wide mb-2">After</h3>
									<p class="text-2xl font-bold text-green-900">{problemSolution.metrics.after}</p>
								</div>
							</div>

							<!-- Improvement Highlight -->
							<div class="mt-6 bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-2 border-blue-200">
								<p class="text-center">
									<span class="text-sm font-semibold text-blue-700 uppercase tracking-wide">Improvement</span>
									<br />
									<span class="text-3xl font-bold text-blue-900">{problemSolution.metrics.improvement}</span>
								</p>
							</div>
						</section>
					{/if}
				</div>

				<!-- Footer -->
				<div class="bg-gray-50 px-8 py-6 border-t border-gray-200">
					<p class="text-sm text-gray-600">
						Last updated on {new Date(problemSolution.updatedAt).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric'
						})}
					</p>
				</div>
			</article>
		{/if}
	</div>
</div>
