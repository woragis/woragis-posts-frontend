<script lang="ts">
	import type { AimlIntegration } from '$lib/api/types';

	type IntegrationType =
		| 'rag'
		| 'llm'
		| 'ml_model'
		| 'computer_vision'
		| 'nlp'
		| 'recommendation'
		| 'chatbot'
		| 'anomaly_detection'
		| 'predictive_analytics'
		| 'generative_ai'
		| 'other';
	type Framework =
		| 'openai'
		| 'anthropic'
		| 'huggingface'
		| 'tensorflow'
		| 'pytorch'
		| 'langchain'
		| 'llamaindex'
		| 'cohere'
		| 'google_ai'
		| 'azure_ai'
		| 'aws_bedrock'
		| 'custom'
		| 'other';

	export let initialData: AimlIntegration | null | undefined = undefined;
	export let onSubmit: (data: any) => Promise<void>;

	let title = initialData?.title || '';
	let description = initialData?.description || '';
	let type: IntegrationType = (initialData?.type as IntegrationType) || 'llm';
	let framework: Framework = (initialData?.framework as Framework) || 'openai';
	let modelName = initialData?.modelName || '';
	let modelVersion = initialData?.modelVersion || '';
	let useCase = initialData?.useCase || '';
	let impact = initialData?.impact || '';
	let architecture = initialData?.architecture || '';
	let demoUrl = initialData?.demoUrl || '';
	let documentationUrl = initialData?.documentationUrl || '';
	let githubUrl = initialData?.githubUrl || '';
	let featured = initialData?.featured || false;
	let displayOrder = initialData?.displayOrder || 0;
	let isSubmitting = false;
	let error: string | null = null;

	const types: { value: IntegrationType; label: string }[] = [
		{ value: 'rag', label: 'RAG (Retrieval-Augmented Generation)' },
		{ value: 'llm', label: 'LLM (Large Language Model)' },
		{ value: 'ml_model', label: 'ML Model' },
		{ value: 'computer_vision', label: 'Computer Vision' },
		{ value: 'nlp', label: 'NLP (Natural Language Processing)' },
		{ value: 'recommendation', label: 'Recommendation System' },
		{ value: 'chatbot', label: 'Chatbot/Virtual Assistant' },
		{ value: 'anomaly_detection', label: 'Anomaly Detection' },
		{ value: 'predictive_analytics', label: 'Predictive Analytics' },
		{ value: 'generative_ai', label: 'Generative AI' },
		{ value: 'other', label: 'Other' }
	];

	const frameworks: { value: Framework; label: string }[] = [
		{ value: 'openai', label: 'OpenAI' },
		{ value: 'anthropic', label: 'Anthropic' },
		{ value: 'huggingface', label: 'Hugging Face' },
		{ value: 'tensorflow', label: 'TensorFlow' },
		{ value: 'pytorch', label: 'PyTorch' },
		{ value: 'langchain', label: 'LangChain' },
		{ value: 'llamaindex', label: 'LlamaIndex' },
		{ value: 'cohere', label: 'Cohere' },
		{ value: 'google_ai', label: 'Google AI' },
		{ value: 'azure_ai', label: 'Azure AI' },
		{ value: 'aws_bedrock', label: 'AWS Bedrock' },
		{ value: 'custom', label: 'Custom' },
		{ value: 'other', label: 'Other' }
	];

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;
		error = null;

		try {
			const data = {
				title: title.trim(),
				description: description.trim(),
				type,
				framework,
				modelName: modelName.trim() || undefined,
				modelVersion: modelVersion.trim() || undefined,
				useCase: useCase.trim() || undefined,
				impact: impact.trim() || undefined,
				architecture: architecture.trim() || undefined,
				demoUrl: demoUrl.trim() || undefined,
				documentationUrl: documentationUrl.trim() || undefined,
				githubUrl: githubUrl.trim() || undefined,
				featured,
				displayOrder: Number(displayOrder)
			};

			await onSubmit(data);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save integration';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form on:submit={handleSubmit} class="space-y-6">
	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="title" class="mb-2 block text-sm font-medium text-gray-700">Title *</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				required
				placeholder="Integration title"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="type" class="mb-2 block text-sm font-medium text-gray-700">Type *</label>
			<select
				id="type"
				bind:value={type}
				required
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			>
				{#each types as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="framework" class="mb-2 block text-sm font-medium text-gray-700">Framework *</label
			>
			<select
				id="framework"
				bind:value={framework}
				required
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			>
				{#each frameworks as opt}
					<option value={opt.value}>{opt.label}</option>
				{/each}
			</select>
		</div>

		<div>
			<label for="displayOrder" class="mb-2 block text-sm font-medium text-gray-700"
				>Display Order</label
			>
			<input
				id="displayOrder"
				type="number"
				bind:value={displayOrder}
				placeholder="0"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>
	</div>

	<div>
		<label for="description" class="mb-2 block text-sm font-medium text-gray-700"
			>Description *</label
		>
		<textarea
			id="description"
			bind:value={description}
			placeholder="Describe this integration..."
			rows="3"
			required
			class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
		></textarea>
	</div>

	<div class="grid grid-cols-3 gap-4">
		<div>
			<label for="modelName" class="mb-2 block text-sm font-medium text-gray-700">Model Name</label>
			<input
				id="modelName"
				type="text"
				bind:value={modelName}
				placeholder="e.g., GPT-4"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="modelVersion" class="mb-2 block text-sm font-medium text-gray-700"
				>Model Version</label
			>
			<input
				id="modelVersion"
				type="text"
				bind:value={modelVersion}
				placeholder="e.g., 1.0.0"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="architecture" class="mb-2 block text-sm font-medium text-gray-700"
				>Architecture</label
			>
			<input
				id="architecture"
				type="text"
				bind:value={architecture}
				placeholder="Architecture type"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div>
			<label for="useCase" class="mb-2 block text-sm font-medium text-gray-700">Use Case</label>
			<textarea
				id="useCase"
				bind:value={useCase}
				placeholder="Describe the use case..."
				rows="2"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			></textarea>
		</div>

		<div>
			<label for="impact" class="mb-2 block text-sm font-medium text-gray-700">Impact</label>
			<textarea
				id="impact"
				bind:value={impact}
				placeholder="Describe the impact..."
				rows="2"
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			></textarea>
		</div>
	</div>

	<div class="grid grid-cols-3 gap-4">
		<div>
			<label for="demoUrl" class="mb-2 block text-sm font-medium text-gray-700">Demo URL</label>
			<input
				id="demoUrl"
				type="url"
				bind:value={demoUrl}
				placeholder="https://..."
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="documentationUrl" class="mb-2 block text-sm font-medium text-gray-700"
				>Documentation URL</label
			>
			<input
				id="documentationUrl"
				type="url"
				bind:value={documentationUrl}
				placeholder="https://..."
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="githubUrl" class="mb-2 block text-sm font-medium text-gray-700">GitHub URL</label>
			<input
				id="githubUrl"
				type="url"
				bind:value={githubUrl}
				placeholder="https://..."
				class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
			/>
		</div>
	</div>

	<div class="flex items-center gap-3">
		<input
			type="checkbox"
			id="featured"
			bind:checked={featured}
			class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
		/>
		<label for="featured" class="text-sm font-medium text-gray-700">Mark as featured</label>
	</div>

	{#if error}
		<div class="rounded-lg bg-red-50 p-3 text-sm text-red-700">
			{error}
		</div>
	{/if}

	<div class="flex gap-3">
		<button
			type="submit"
			disabled={isSubmitting}
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{isSubmitting ? 'Saving...' : initialData ? 'Update Integration' : 'Create Integration'}
		</button>
		<a
			href="/aiml-integrations"
			class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
		>
			Cancel
		</a>
	</div>
</form>
