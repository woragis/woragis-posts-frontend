<script lang="ts">
	import SystemDesignBadge from './SystemDesignBadge.svelte';
	import type { SystemDesign } from '$lib/api/types';

	export let design: SystemDesign;
</script>

<div class="space-y-6 rounded-lg bg-white p-8 shadow-lg">
	<div class="border-b pb-6">
		<div class="mb-4 flex items-start justify-between">
			<div>
				<div class="mb-2 flex items-center gap-2">
					<SystemDesignBadge title="System Design" />
					{#if design.featured}
						<span class="text-2xl">⭐</span>
					{/if}
				</div>
				<h1 class="text-3xl font-bold text-gray-900">{design.title}</h1>
			</div>
		</div>
		<p class="text-lg text-gray-600">{design.description}</p>
	</div>

	<div class="grid gap-8 md:grid-cols-2">
		<div>
			<h2 class="mb-4 text-xl font-bold text-gray-900">Data Flow</h2>
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="whitespace-pre-wrap text-gray-700">{design.dataFlow}</p>
			</div>
		</div>

		<div>
			<h2 class="mb-4 text-xl font-bold text-gray-900">Scalability</h2>
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="whitespace-pre-wrap text-gray-700">{design.scalability}</p>
			</div>
		</div>
	</div>

	<div class="grid gap-8 md:grid-cols-2">
		<div>
			<h2 class="mb-4 text-xl font-bold text-gray-900">Reliability</h2>
			<div class="rounded-lg bg-gray-50 p-4">
				<p class="whitespace-pre-wrap text-gray-700">{design.reliability}</p>
			</div>
		</div>

		{#if design.diagram}
			<div>
				<h2 class="mb-4 text-xl font-bold text-gray-900">Architecture Diagram</h2>
				<img src={design.diagram} alt="Architecture Diagram" class="w-full rounded-lg" />
			</div>
		{/if}
	</div>

	{#if design.components?.components && design.components.components.length > 0}
		<div>
			<h2 class="mb-4 text-xl font-bold text-gray-900">Components</h2>
			<div class="space-y-4">
				{#each design.components.components as component (component.name)}
					<div class="rounded-lg border border-gray-200 p-4">
						<h3 class="font-semibold text-gray-900">{component.name}</h3>
						{#if component.description}
							<p class="mt-1 text-sm text-gray-600">{component.description}</p>
						{/if}
						{#if component.responsibilities && component.responsibilities.length > 0}
							<ul class="mt-2 space-y-1">
								{#each component.responsibilities as resp}
									<li class="text-sm text-gray-600">• {resp}</li>
								{/each}
							</ul>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="border-t pt-6 text-sm text-gray-600">
		<p>Created: {new Date(design.createdAt).toLocaleDateString()}</p>
		<p>Updated: {new Date(design.updatedAt).toLocaleDateString()}</p>
	</div>
</div>
