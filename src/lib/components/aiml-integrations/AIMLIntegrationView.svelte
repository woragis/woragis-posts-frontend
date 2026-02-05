<script lang="ts">
	import type { AimlIntegration } from '$lib/api/types';

	export let integration: AimlIntegration;

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

	function getFrameworkLabel(framework: string): string {
		const labels: Record<string, string> = {
			openai: 'OpenAI',
			anthropic: 'Anthropic',
			huggingface: 'Hugging Face',
			tensorflow: 'TensorFlow',
			pytorch: 'PyTorch',
			langchain: 'LangChain',
			llamaindex: 'LlamaIndex',
			cohere: 'Cohere',
			google_ai: 'Google AI',
			azure_ai: 'Azure AI',
			aws_bedrock: 'AWS Bedrock',
			custom: 'Custom',
			other: 'Other'
		};
		return labels[framework] || framework;
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<div class="space-y-6 rounded-lg border border-gray-200 bg-white p-8">
	<div class="border-b pb-6">
		<div class="flex items-start justify-between">
			<div>
				<h2 class="text-3xl font-bold text-gray-900">🤖 {integration.title}</h2>
				{#if integration.featured}
					<div class="mt-2 flex items-center gap-2 text-amber-600">
						<span>⭐</span>
						<span class="text-sm font-medium">Featured Integration</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="mt-4 flex flex-wrap gap-3">
			<span
				class="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
			>
				{getTypeLabel(integration.type)}
			</span>
			<span
				class="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
			>
				{getFrameworkLabel(integration.framework)}
			</span>
		</div>
	</div>

	<div>
		<h3 class="mb-2 text-sm font-semibold text-gray-500 uppercase">Description</h3>
		<p class="text-gray-900">{integration.description}</p>
	</div>

	{#if integration.useCase}
		<div>
			<h3 class="mb-2 text-sm font-semibold text-gray-500 uppercase">Use Case</h3>
			<p class="text-gray-900">{integration.useCase}</p>
		</div>
	{/if}

	{#if integration.impact}
		<div>
			<h3 class="mb-2 text-sm font-semibold text-gray-500 uppercase">Impact</h3>
			<p class="text-gray-900">{integration.impact}</p>
		</div>
	{/if}

	<div class="grid grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
		{#if integration.modelName}
			<div>
				<div class="text-xs font-semibold text-gray-500 uppercase">Model</div>
				<div class="mt-1 text-sm font-medium text-gray-900">{integration.modelName}</div>
				{#if integration.modelVersion}
					<div class="text-xs text-gray-600">v{integration.modelVersion}</div>
				{/if}
			</div>
		{/if}

		{#if integration.architecture}
			<div>
				<div class="text-xs font-semibold text-gray-500 uppercase">Architecture</div>
				<div class="mt-1 text-sm text-gray-900">{integration.architecture}</div>
			</div>
		{/if}

		{#if integration.technologies && integration.technologies.length > 0}
			<div>
				<div class="text-xs font-semibold text-gray-500 uppercase">Technologies</div>
				<div class="mt-1 flex flex-wrap gap-1">
					{#each integration.technologies as tech}
						<span class="inline-block rounded bg-blue-100 px-2 py-1 text-xs text-blue-800"
							>{tech}</span
						>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	{#if integration.metrics}
		<div>
			<h3 class="mb-2 text-sm font-semibold text-gray-500 uppercase">Metrics</h3>
			<p class="text-gray-900">{integration.metrics}</p>
		</div>
	{/if}

	{#if integration.demoUrl || integration.documentationUrl || integration.githubUrl}
		<div class="flex flex-wrap gap-3">
			{#if integration.demoUrl}
				<a
					href={integration.demoUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 rounded-lg bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
				>
					🔗 Demo
				</a>
			{/if}
			{#if integration.documentationUrl}
				<a
					href={integration.documentationUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
				>
					📖 Docs
				</a>
			{/if}
			{#if integration.githubUrl}
				<a
					href={integration.githubUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="inline-flex items-center gap-1 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
				>
					💻 GitHub
				</a>
			{/if}
		</div>
	{/if}

	<div class="border-t pt-6">
		<div class="grid grid-cols-4 gap-4">
			<div>
				<div class="text-xs font-semibold text-gray-500 uppercase">Created</div>
				<div class="mt-1 text-sm text-gray-900">{formatDate(integration.createdAt)}</div>
			</div>
			<div>
				<div class="text-xs font-semibold text-gray-500 uppercase">Last Updated</div>
				<div class="mt-1 text-sm text-gray-900">{formatDate(integration.updatedAt)}</div>
			</div>
			{#if integration.displayOrder >= 0}
				<div>
					<div class="text-xs font-semibold text-gray-500 uppercase">Display Order</div>
					<div class="mt-1 text-sm text-gray-900">#{integration.displayOrder}</div>
				</div>
			{/if}
		</div>
	</div>
</div>
