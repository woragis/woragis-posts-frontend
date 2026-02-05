<script lang="ts">
	import type { TechnicalWriting } from '$lib/api/types';
	import WritingTypeBadge from './WritingTypeBadge.svelte';
	import PlatformBadge from './PlatformBadge.svelte';

	export let writing: TechnicalWriting;
</script>

<div class="overflow-hidden rounded-lg bg-white shadow-lg">
	<!-- Header with Cover Image or Gradient -->
	<div
		class="relative h-64 bg-gradient-to-br from-blue-500 to-blue-700"
		style={writing.coverImageUrl
			? `background-image: url('${writing.coverImageUrl}'); background-size: cover;`
			: ''}
	>
		{#if writing.featured}
			<div
				class="absolute top-4 right-4 rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-gray-900"
			>
				⭐ Featured
			</div>
		{/if}
	</div>

	<!-- Content -->
	<div class="space-y-6 p-8">
		<!-- Badges -->
		<div class="flex flex-wrap gap-3">
			<WritingTypeBadge type={writing.type} />
			<PlatformBadge platform={writing.platform} />
		</div>

		<!-- Title -->
		<h1 class="text-4xl font-bold text-gray-900">{writing.title}</h1>

		<!-- Metadata Row -->
		<div class="flex flex-wrap gap-6 text-sm text-gray-600">
			{#if writing.publishedAt}
				<div>
					<span class="font-semibold">Published:</span>
					{new Date(writing.publishedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</div>
			{/if}
			{#if writing.readingTime}
				<div>
					<span class="font-semibold">Reading Time:</span>
					{writing.readingTime} min
				</div>
			{/if}
			{#if writing.updatedAt}
				<div>
					<span class="font-semibold">Updated:</span>
					{new Date(writing.updatedAt).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'short',
						day: 'numeric'
					})}
				</div>
			{/if}
		</div>

		<!-- Excerpt -->
		{#if writing.excerpt}
			<p class="text-lg text-gray-700 italic">{writing.excerpt}</p>
		{/if}

		<!-- Engagement Metrics -->
		<div class="grid grid-cols-4 gap-4 rounded-lg bg-gray-50 p-6">
			<div class="text-center">
				<div class="text-3xl">👁️</div>
				<div class="mt-2 text-sm text-gray-600">Views</div>
				<div class="text-2xl font-bold text-blue-600">{writing.views || 0}</div>
			</div>
			<div class="text-center">
				<div class="text-3xl">❤️</div>
				<div class="mt-2 text-sm text-gray-600">Likes</div>
				<div class="text-2xl font-bold text-red-600">{writing.likes || 0}</div>
			</div>
			<div class="text-center">
				<div class="text-3xl">🔄</div>
				<div class="mt-2 text-sm text-gray-600">Shares</div>
				<div class="text-2xl font-bold text-purple-600">{writing.shares || 0}</div>
			</div>
			<div class="text-center">
				<div class="text-3xl">💬</div>
				<div class="mt-2 text-sm text-gray-600">Comments</div>
				<div class="text-2xl font-bold text-amber-600">{writing.comments || 0}</div>
			</div>
		</div>

		<!-- Description -->
		<div class="space-y-2">
			<h2 class="text-xl font-semibold text-gray-900">Overview</h2>
			<p class="leading-relaxed text-gray-700">{writing.description}</p>
		</div>

		<!-- Content -->
		{#if writing.content}
			<div class="space-y-2">
				<h2 class="text-xl font-semibold text-gray-900">Content</h2>
				<div class="prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap text-gray-700">
					{writing.content}
				</div>
			</div>
		{/if}

		<!-- Technologies -->
		{#if writing.technologies && writing.technologies.length > 0}
			<div class="space-y-3">
				<h3 class="text-lg font-semibold text-gray-900">Technologies Used</h3>
				<div class="flex flex-wrap gap-2">
					{#each writing.technologies as tech}
						<span
							class="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-800"
						>
							{tech}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Topics -->
		{#if writing.topics && writing.topics.length > 0}
			<div class="space-y-3">
				<h3 class="text-lg font-semibold text-gray-900">Topics</h3>
				<div class="flex flex-wrap gap-2">
					{#each writing.topics as topic}
						<span
							class="inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-800"
						>
							#{topic}
						</span>
					{/each}
				</div>
			</div>
		{/if}

		<!-- External Link -->
		<div class="border-t pt-6">
			<a
				href={writing.url}
				target="_blank"
				rel="noopener noreferrer"
				class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
			>
				Read on {writing.platform === 'dev_to'
					? 'Dev.to'
					: writing.platform === 'company_blog'
						? 'Company Blog'
						: writing.platform === 'personal_blog'
							? 'Personal Blog'
							: writing.platform.charAt(0).toUpperCase() + writing.platform.slice(1)}
				<span>↗</span>
			</a>
		</div>

		<!-- Footer Info -->
		<div class="border-t pt-4 text-xs text-gray-500">
			{#if writing.projectId}
				<div>Related to project: {writing.projectId}</div>
			{/if}
			{#if writing.caseStudyId}
				<div>Related to case study: {writing.caseStudyId}</div>
			{/if}
		</div>
	</div>
</div>
