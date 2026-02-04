<script lang="ts">
	import type { CaseStudy } from '$lib/api/types';

	export let caseStudy: CaseStudy | null = null;
	export let isLoading = false;
</script>

<div class="min-h-screen bg-gray-50 py-12">
	<div class="mx-auto max-w-3xl px-4">
		{#if isLoading}
			<div class="text-center">
				<p class="text-gray-500">Loading case study...</p>
			</div>
		{:else if !caseStudy}
			<div class="text-center">
				<p class="text-gray-500">Case study not found</p>
			</div>
		{:else}
			<article class="rounded-lg bg-white p-8 shadow-lg">
				<header class="mb-8 border-b pb-6">
					<h1 class="mb-2 text-4xl font-bold text-gray-900">{caseStudy.title}</h1>
					{#if caseStudy.createdAt}
						<p class="text-sm text-gray-500">
							Published on {new Date(caseStudy.createdAt).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric'
							})}
						</p>
					{/if}
				</header>

				{#if caseStudy.description}
					<div class="prose prose-lg mb-8 max-w-none">
						<p>{caseStudy.description}</p>
					</div>
				{/if}

				{#if caseStudy.status}
					<footer class="mt-8 border-t pt-6">
						<p class="text-sm text-gray-500">
							Status: <span class="font-semibold">{caseStudy.status}</span>
						</p>
					</footer>
				{/if}
			</article>
		{/if}
	</div>
</div>
