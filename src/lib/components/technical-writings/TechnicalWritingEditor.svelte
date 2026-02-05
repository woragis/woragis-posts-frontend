<script lang="ts">
	import { TechAutocomplete } from '$lib/components/problem-solutions';
	import TopicAutocomplete from './TopicAutocomplete.svelte';
	import WritingTypeBadge from './WritingTypeBadge.svelte';
	import PlatformBadge from './PlatformBadge.svelte';
	import type {
		TechnicalWriting,
		CreateTechnicalWritingRequest,
		UpdateTechnicalWritingRequest,
		WritingType,
		WritingPublicationPlatform
	} from '$lib/api/types';

	export let initialData: TechnicalWriting | null = null;
	export let onSubmit: (
		data: CreateTechnicalWritingRequest | UpdateTechnicalWritingRequest
	) => Promise<void> = async () => {};

	let title = initialData?.title || '';
	let description = initialData?.description || '';
	let type: WritingType = initialData?.type || 'article';
	let platform: WritingPublicationPlatform = initialData?.platform || 'medium';
	let url = initialData?.url || '';
	let canonicalUrl = initialData?.canonicalUrl || '';
	let content = initialData?.content || '';
	let excerpt = initialData?.excerpt || '';
	let coverImageUrl = initialData?.coverImageUrl || '';
	let publishedAt = initialData?.publishedAt ? initialData.publishedAt.split('T')[0] : '';
	let readingTime = initialData?.readingTime || 0;
	let topics = initialData?.topics || [];
	let technologies = initialData?.technologies || [];
	let views = initialData?.views || 0;
	let likes = initialData?.likes || 0;
	let shares = initialData?.shares || 0;
	let comments = initialData?.comments || 0;
	let projectId = initialData?.projectId || '';
	let caseStudyId = initialData?.caseStudyId || '';
	let featured = initialData?.featured || false;
	let displayOrder = initialData?.displayOrder || 0;

	let isSubmitting = false;
	let error = '';

	const writingTypes: WritingType[] = [
		'article',
		'documentation',
		'tutorial',
		'guide',
		'blog_post',
		'case_study',
		'other'
	];
	const platforms: WritingPublicationPlatform[] = [
		'medium',
		'dev_to',
		'hashnode',
		'personal_blog',
		'github',
		'company_blog',
		'substack',
		'linkedin',
		'other'
	];

	async function handleSubmit() {
		if (!title.trim()) {
			error = 'Title is required';
			return;
		}
		if (!description.trim()) {
			error = 'Description is required';
			return;
		}
		if (!url.trim()) {
			error = 'URL is required';
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			const data = {
				title: title.trim(),
				description: description.trim(),
				type,
				platform,
				url: url.trim(),
				canonicalUrl: canonicalUrl.trim() || undefined,
				content: content.trim() || undefined,
				excerpt: excerpt.trim() || undefined,
				coverImageUrl: coverImageUrl.trim() || undefined,
				publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
				readingTime: readingTime || undefined,
				topics: topics.length > 0 ? topics : undefined,
				technologies: technologies.length > 0 ? technologies : undefined,
				views: views || undefined,
				likes: likes || undefined,
				shares: shares || undefined,
				comments: comments || undefined,
				projectId: projectId || undefined,
				caseStudyId: caseStudyId || undefined,
				featured,
				displayOrder: featured ? displayOrder : undefined
			};

			await onSubmit(data);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to save writing';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-8 rounded-lg bg-white p-6 shadow">
	{#if error}
		<div class="rounded-md bg-red-50 p-4">
			<p class="text-sm text-red-700">{error}</p>
		</div>
	{/if}

	<!-- Basic Info Section -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>

		<div>
			<label for="title" class="mb-2 block text-sm font-medium text-gray-700">Title *</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				placeholder="Enter writing title"
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="description" class="mb-2 block text-sm font-medium text-gray-700"
				>Description *</label
			>
			<textarea
				id="description"
				bind:value={description}
				placeholder="Brief description of the writing"
				rows={3}
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			></textarea>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="type" class="mb-2 block text-sm font-medium text-gray-700">Type *</label>
				<select
					id="type"
					bind:value={type}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				>
					{#each writingTypes as wType}
						<option value={wType}>{wType}</option>
					{/each}
				</select>
				<div class="mt-2">
					<WritingTypeBadge {type} />
				</div>
			</div>

			<div>
				<label for="platform" class="mb-2 block text-sm font-medium text-gray-700">Platform *</label
				>
				<select
					id="platform"
					bind:value={platform}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				>
					{#each platforms as plat}
						<option value={plat}>{plat}</option>
					{/each}
				</select>
				<div class="mt-2">
					<PlatformBadge {platform} />
				</div>
			</div>
		</div>
	</div>

	<!-- URLs Section -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">URLs & Links</h3>

		<div>
			<label for="url" class="mb-2 block text-sm font-medium text-gray-700">Publication URL *</label
			>
			<input
				id="url"
				type="url"
				bind:value={url}
				placeholder="https://..."
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
		</div>

		<div>
			<label for="canonical-url" class="mb-2 block text-sm font-medium text-gray-700"
				>Canonical URL</label
			>
			<input
				id="canonical-url"
				type="url"
				bind:value={canonicalUrl}
				placeholder="https://..."
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
	</div>

	<!-- Content Section -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">Content</h3>

		<div>
			<label for="excerpt" class="mb-2 block text-sm font-medium text-gray-700">
				Excerpt ({excerpt.length}/140)
			</label>
			<textarea
				id="excerpt"
				bind:value={excerpt}
				placeholder="Short excerpt for previews (max 140 characters)"
				rows={2}
				maxlength={140}
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			></textarea>
		</div>

		<div>
			<label for="content" class="mb-2 block text-sm font-medium text-gray-700">Full Content</label>
			<textarea
				id="content"
				bind:value={content}
				placeholder="Full content or notes about the writing"
				rows={6}
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			></textarea>
		</div>

		<div>
			<label for="cover-image" class="mb-2 block text-sm font-medium text-gray-700"
				>Cover Image URL</label
			>
			<input
				id="cover-image"
				type="url"
				bind:value={coverImageUrl}
				placeholder="https://..."
				class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
	</div>

	<!-- Publication Details -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">Publication Details</h3>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="published-at" class="mb-2 block text-sm font-medium text-gray-700"
					>Published Date</label
				>
				<input
					id="published-at"
					type="date"
					bind:value={publishedAt}
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="reading-time" class="mb-2 block text-sm font-medium text-gray-700">
					Reading Time (minutes)
				</label>
				<input
					id="reading-time"
					type="number"
					bind:value={readingTime}
					min="0"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		</div>
	</div>

	<!-- Classification -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">Classification</h3>

		<div>
			<label for="topics-input" class="mb-2 block text-sm font-medium text-gray-700">Topics</label>
			<TopicAutocomplete id="topics-input" bind:selectedTopics={topics} />
		</div>

		<div>
			<label for="technologies" class="mb-2 block text-sm font-medium text-gray-700"
				>Technologies</label
			>
			<TechAutocomplete id="technologies-input" bind:selectedTechs={technologies} />
		</div>
	</div>

	<!-- Engagement Metrics -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">Engagement Metrics</h3>

		<div class="grid grid-cols-4 gap-4">
			<div>
				<label for="views" class="mb-2 block text-sm font-medium text-gray-700">👁️ Views</label>
				<input
					id="views"
					type="number"
					bind:value={views}
					min="0"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="likes" class="mb-2 block text-sm font-medium text-gray-700">❤️ Likes</label>
				<input
					id="likes"
					type="number"
					bind:value={likes}
					min="0"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="shares" class="mb-2 block text-sm font-medium text-gray-700">🔄 Shares</label>
				<input
					id="shares"
					type="number"
					bind:value={shares}
					min="0"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="comments" class="mb-2 block text-sm font-medium text-gray-700"
					>💬 Comments</label
				>
				<input
					id="comments"
					type="number"
					bind:value={comments}
					min="0"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		</div>

		<!-- Visual Metrics Display -->
		<div class="mt-4 grid grid-cols-4 gap-2">
			<div class="rounded bg-blue-50 p-3 text-center">
				<div class="text-2xl">👁️</div>
				<div class="text-xs text-gray-600">Views</div>
				<div class="text-lg font-semibold text-blue-600">{views}</div>
			</div>
			<div class="rounded bg-red-50 p-3 text-center">
				<div class="text-2xl">❤️</div>
				<div class="text-xs text-gray-600">Likes</div>
				<div class="text-lg font-semibold text-red-600">{likes}</div>
			</div>
			<div class="rounded bg-purple-50 p-3 text-center">
				<div class="text-2xl">🔄</div>
				<div class="text-xs text-gray-600">Shares</div>
				<div class="text-lg font-semibold text-purple-600">{shares}</div>
			</div>
			<div class="rounded bg-amber-50 p-3 text-center">
				<div class="text-2xl">💬</div>
				<div class="text-xs text-gray-600">Comments</div>
				<div class="text-lg font-semibold text-amber-600">{comments}</div>
			</div>
		</div>
	</div>

	<!-- Relations -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">Relations</h3>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<label for="project-id" class="mb-2 block text-sm font-medium text-gray-700"
					>Related Project ID</label
				>
				<input
					id="project-id"
					type="text"
					bind:value={projectId}
					placeholder="Project UUID (optional)"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>

			<div>
				<label for="case-study-id" class="mb-2 block text-sm font-medium text-gray-700">
					Related Case Study ID
				</label>
				<input
					id="case-study-id"
					type="text"
					bind:value={caseStudyId}
					placeholder="Case Study UUID (optional)"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		</div>
	</div>

	<!-- Display Settings -->
	<div class="space-y-4 border-b pb-6">
		<h3 class="text-lg font-semibold text-gray-900">Display Settings</h3>

		<div class="flex items-center">
			<input
				id="featured"
				type="checkbox"
				bind:checked={featured}
				class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
			/>
			<label for="featured" class="ml-2 block text-sm text-gray-900">
				Featured (show on portfolio homepage)
			</label>
		</div>

		{#if featured}
			<div>
				<label for="display-order" class="mb-2 block text-sm font-medium text-gray-700"
					>Display Order</label
				>
				<input
					id="display-order"
					type="number"
					bind:value={displayOrder}
					min="0"
					placeholder="Lower numbers appear first"
					class="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		{/if}
	</div>

	<!-- Submit Button -->
	<div class="flex justify-end">
		<button
			type="submit"
			disabled={isSubmitting}
			class="rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
		>
			{isSubmitting ? 'Saving...' : initialData ? 'Update Writing' : 'Create Writing'}
		</button>
	</div>
</form>
