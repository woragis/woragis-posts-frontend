<script lang="ts">
	import type { WritingType } from '$lib/api/types';

	export let type: WritingType;

	const typeColors: Record<WritingType, { bg: string; text: string }> = {
		article: { bg: 'bg-blue-100', text: 'text-blue-700' },
		tutorial: { bg: 'bg-green-100', text: 'text-green-700' },
		guide: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
		documentation: { bg: 'bg-violet-100', text: 'text-violet-700' },
		blog_post: { bg: 'bg-pink-100', text: 'text-pink-700' },
		case_study: { bg: 'bg-amber-100', text: 'text-amber-700' },
		other: { bg: 'bg-gray-100', text: 'text-gray-700' }
	};

	const typeLabels: Record<WritingType, string> = {
		article: 'Article',
		tutorial: 'Tutorial',
		guide: 'Guide',
		documentation: 'Documentation',
		blog_post: 'Blog Post',
		case_study: 'Case Study',
		other: 'Other'
	};

	const colors = typeColors[type];
	const label = typeLabels[type];
</script>

<span
	class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {colors.bg} {colors.text}"
>
	{label}
</span>
