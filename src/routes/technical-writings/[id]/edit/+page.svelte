<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { technicalWritings } from '$lib/stores/technical-writings';
	import { TechnicalWritingEditor, TechnicalWritingView } from '$lib/components/technical-writings';
	import { GenerationModal } from '$lib/components/assets';
	import type { UpdateTechnicalWritingRequest } from '$lib/api/types';

	let writingId: string = $page.params.id || '';
	let showModal = false;

	onMount(async () => {
		if (writingId) {
			await technicalWritings.loadOne(writingId);
		}
	});

	async function handleSubmit(data: UpdateTechnicalWritingRequest) {
		try {
			await technicalWritings.updateWriting(writingId, data);
		} catch (err) {
			console.error('Failed to update writing:', err);
		}
	}

	function handleDelete() {
		if (confirm('Are you sure you want to delete this writing?')) {
			technicalWritings.deleteWriting(writingId).then(() => {
				goto('/technical-writings');
			});
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="space-y-6 px-4 py-6 sm:px-0">
			{#if $technicalWritings.currentWriting}
				<div>
					<button
						on:click={() => goto('/technical-writings')}
						class="mb-4 font-medium text-blue-600 hover:text-blue-900"
					>
						← Back to Writings
					</button>
					<div class="flex items-start justify-between">
						<h1 class="text-3xl font-bold text-gray-900">
							{$technicalWritings.currentWriting.title}
						</h1>
						<button
							on:click={handleDelete}
							class="rounded-md bg-red-600 px-3 py-2 font-medium text-white hover:bg-red-700"
						>
							Delete
						</button>
					</div>
				</div>

				<div class="grid grid-cols-3 gap-6">
					<div class="col-span-2">
						<TechnicalWritingEditor
							initialData={$technicalWritings.currentWriting}
							onSubmit={handleSubmit}
						/>
					</div>

					<div class="space-y-4">
						<button
							on:click={() => (showModal = true)}
							class="w-full rounded-md bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
						>
							Generate Assets
						</button>

						{#if $technicalWritings.currentWriting.featured}
							<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<p class="text-sm text-blue-900">
									<strong>⭐ Featured</strong><br />
									This writing is featured in your portfolio
								</p>
							</div>
						{/if}

						<div class="rounded-lg bg-white p-4 shadow">
							<p class="text-sm text-gray-600">
								<strong>Created:</strong><br />
								{new Date($technicalWritings.currentWriting.createdAt).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>
			{:else}
				<div class="rounded-lg bg-white py-12 text-center shadow">
					<p class="text-gray-500">Loading...</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<GenerationModal
	contentId={writingId}
	domainType="technical-writing"
	title="Generate Creative Assets"
	description="Generate professional images for your technical writing"
/>
