<script lang="ts">
	import { goto } from '$app/navigation';
	import { createCaseStudy, updateCaseStudy } from '$lib/stores/case-studies';
	import type { CaseStudy } from '$lib/api/types';

	export let caseStudy: CaseStudy | null = null;
	export let onSave: ((caseStudy: CaseStudy) => void) | null = null;

	let title = caseStudy?.title || '';
	let slug = caseStudy?.slug || '';
	let description = caseStudy?.description || '';
	let status: 'draft' | 'published' | 'archived' = (caseStudy?.status as any) || 'draft';
	let isSaving = false;
	let error = '';

	async function handleSubmit() {
		if (!title.trim()) {
			error = 'Title is required';
			return;
		}

		isSaving = true;
		error = '';

		try {
			const data = {
				title: title.trim(),
				slug: slug.trim() || undefined,
				description: description.trim() || undefined,
				status
			};

			let result;
			if (caseStudy?.id) {
				result = await updateCaseStudy(caseStudy.id, data);
			} else {
				result = await createCaseStudy(data);
			}

			if (result) {
				if (onSave) {
					onSave(result);
				}
				await goto(`/case-studies/${result.id}/edit`);
			} else {
				error = 'Failed to save case study';
			}
		} catch (err: any) {
			error = err.message || 'Failed to save case study';
		} finally {
			isSaving = false;
		}
	}
</script>

<div class="rounded-lg bg-white p-6 shadow">
	<h2 class="mb-6 text-2xl font-bold">{caseStudy ? 'Edit' : 'Create'} Case Study</h2>

	{#if error}
		<div class="mb-4 rounded-md bg-red-50 p-4">
			<p class="text-sm text-red-700">{error}</p>
		</div>
	{/if}

	<form on:submit|preventDefault={handleSubmit} class="space-y-6">
		<div>
			<label for="title" class="mb-1 block text-sm font-medium text-gray-700">Title *</label>
			<input
				id="title"
				type="text"
				bind:value={title}
				required
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				placeholder="Case Study Title"
			/>
		</div>

		<div>
			<label for="slug" class="mb-1 block text-sm font-medium text-gray-700">Slug</label>
			<input
				id="slug"
				type="text"
				bind:value={slug}
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				placeholder="case-study-slug"
			/>
		</div>

		<div>
			<label for="description" class="mb-1 block text-sm font-medium text-gray-700"
				>Description</label
			>
			<textarea
				id="description"
				bind:value={description}
				rows={5}
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
				placeholder="Case study description..."
			></textarea>
		</div>

		<div>
			<label for="status" class="mb-1 block text-sm font-medium text-gray-700">Status</label>
			<select
				id="status"
				bind:value={status}
				class="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
			>
				<option value="draft">Draft</option>
				<option value="published">Published</option>
				<option value="archived">Archived</option>
			</select>
		</div>

		<div class="flex gap-4 pt-4">
			<button
				type="submit"
				disabled={isSaving}
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
			>
				{isSaving ? 'Saving...' : 'Save Case Study'}
			</button>
			<button
				type="button"
				on:click={() => goto('/case-studies')}
				class="rounded-md border border-gray-300 px-4 py-2 hover:bg-gray-50"
			>
				Cancel
			</button>
		</div>
	</form>
</div>
