<script lang="ts">
	import { marked } from 'marked';

	export let markdown = '';

	let htmlContent = '';

	$: {
		marked.parse(markdown).then((html) => {
			htmlContent = html;
		});
	}
</script>

<div
	class="prose prose-sm max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-red-600 prose-pre:bg-gray-100 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded prose-pre:overflow-x-auto"
>
	{@html htmlContent}
</div>
