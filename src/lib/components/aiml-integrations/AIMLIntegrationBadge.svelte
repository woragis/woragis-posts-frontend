<script lang="ts">
	export let type: string = '';
	export let framework: string = '';
	export let featured: boolean = false;
	function getTypeLabel(t: string): string {
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
		return labels[t] || t;
	}

	function getFrameworkLabel(f: string): string {
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
		return labels[f] || f;
	}
</script>

<div class="flex items-center gap-2">
	<span
		class="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
	>
		🤖 {getTypeLabel(type)}
	</span>
	<span
		class="inline-flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
	>
		{getFrameworkLabel(framework)}
	</span>
	{#if featured}
		<span
			class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
		>
			⭐
		</span>
	{/if}
</div>
