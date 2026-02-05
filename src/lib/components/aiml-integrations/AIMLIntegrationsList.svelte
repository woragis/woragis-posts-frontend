<script lang="ts">
	import { aimlIntegrations } from '$lib/stores/aiml-integrations';
	import { AIMLIntegrationBadge } from './index';

	let currentPage = 1;
	const itemsPerPage = 10;

	function getTypeLabel(type: string): string {
		const labels: Record<string, string> = {
			rag: 'RAG',
			llm: 'LLM',
			ml_model: 'ML Model',
			computer_vision: 'Computer Vision',
			nlp: 'NLP',
			recommendation: 'Recommendation',
			chatbot: 'Chatbot',
			anomaly_detection: 'Anomaly Detection',
			predictive_analytics: 'Predictive Analytics',
			generative_ai: 'Generative AI',
			other: 'Other'
		};
		return labels[type] || type;
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function handleDelete(id: string) {
		if (confirm('Are you sure you want to delete this integration?')) {
			aimlIntegrations.deleteIntegration(id);
		}
	}

	$: paginatedItems = $aimlIntegrations.items.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil($aimlIntegrations.items.length / itemsPerPage);
</script>

<div class="space-y-4">
	<div class="flex items-center justify-between">
		<h2 class="text-xl font-semibold text-gray-900">
			{$aimlIntegrations.items.length} Integration{$aimlIntegrations.items.length !== 1 ? 's' : ''}
		</h2>
		<a
			href="/aiml-integrations/new"
			class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
		>
			+ New Integration
		</a>
	</div>

	{#if $aimlIntegrations.isLoading}
		<div class="py-8 text-center">
			<div
				class="inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-indigo-600"
			></div>
			<p class="mt-2 text-gray-600">Loading integrations...</p>
		</div>
	{:else if $aimlIntegrations.error}
		<div class="rounded-lg bg-red-50 p-4 text-sm text-red-700">
			{$aimlIntegrations.error}
		</div>
	{:else if $aimlIntegrations.items.length === 0}
		<div class="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
			<p class="text-gray-600">No integrations yet. Start by creating one!</p>
		</div>
	{:else}
		<div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
			<table class="w-full text-sm">
				<thead class="border-b border-gray-200 bg-gray-50">
					<tr>
						<th class="px-6 py-3 text-left font-semibold text-gray-900">Title</th>
						<th class="px-6 py-3 text-left font-semibold text-gray-900">Type & Framework</th>
						<th class="px-6 py-3 text-left font-semibold text-gray-900">Created</th>
						<th class="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200">
					{#each paginatedItems as integration (integration.id)}
						<tr class="transition-colors hover:bg-gray-50">
							<td class="px-6 py-4">
								<div class="font-medium text-gray-900">{integration.title}</div>
								{#if integration.description}
									<div class="mt-1 line-clamp-1 text-xs text-gray-500">
										{integration.description}
									</div>
								{/if}
							</td>
							<td class="px-6 py-4">
								<AIMLIntegrationBadge
									type={integration.type}
									framework={integration.framework}
									featured={integration.featured}
								/>
							</td>
							<td class="px-6 py-4 text-gray-600">
								{formatDate(integration.createdAt)}
							</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
									<a
										href="/aiml-integrations/{integration.id}"
										class="font-medium text-blue-600 hover:text-blue-800"
									>
										👁️
									</a>
									<a
										href="/aiml-integrations/{integration.id}/edit"
										class="font-medium text-green-600 hover:text-green-800"
									>
										✏️
									</a>
									<button
										on:click={() => handleDelete(integration.id)}
										class="font-medium text-red-600 hover:text-red-800"
									>
										🗑️
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		{#if totalPages > 1}
			<div class="flex items-center justify-between">
				<button
					disabled={currentPage === 1}
					on:click={() => currentPage--}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					← Previous
				</button>
				<span class="text-sm text-gray-600">
					Page {currentPage} of {totalPages}
				</span>
				<button
					disabled={currentPage === totalPages}
					on:click={() => currentPage++}
					class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
				>
					Next →
				</button>
			</div>
		{/if}
	{/if}
</div>
