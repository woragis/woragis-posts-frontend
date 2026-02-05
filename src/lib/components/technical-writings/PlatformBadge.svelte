<script lang="ts">
	import type { WritingPublicationPlatform } from '$lib/api/types';

	export let platform: WritingPublicationPlatform;

	const platformColors: Record<WritingPublicationPlatform, { bg: string; text: string }> = {
		medium: { bg: 'bg-orange-100', text: 'text-orange-700' },
		dev_to: { bg: 'bg-gray-900', text: 'text-white' },
		hashnode: { bg: 'bg-blue-100', text: 'text-blue-700' },
		personal_blog: { bg: 'bg-slate-100', text: 'text-slate-700' },
		github: { bg: 'bg-gray-900', text: 'text-white' },
		company_blog: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
		substack: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
		linkedin: { bg: 'bg-blue-500', text: 'text-white' },
		other: { bg: 'bg-gray-100', text: 'text-gray-700' }
	};

	const platformLabels: Record<WritingPublicationPlatform, string> = {
		medium: 'Medium',
		dev_to: 'Dev.to',
		hashnode: 'Hashnode',
		personal_blog: 'Personal Blog',
		github: 'GitHub',
		company_blog: 'Company Blog',
		substack: 'Substack',
		linkedin: 'LinkedIn',
		other: 'Other'
	};

	const colors = platformColors[platform];
	const label = platformLabels[platform];
</script>

<span
	class="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium {colors.bg} {colors.text}"
>
	{label}
</span>
