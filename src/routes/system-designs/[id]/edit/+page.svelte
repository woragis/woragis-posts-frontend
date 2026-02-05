<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { systemDesigns } from '$lib/stores/system-designs';
	import { SystemDesignEditor } from '$lib/components/system-designs';
	import { GenerationModal } from '$lib/components/assets';
	import type { UpdateSystemDesignRequest } from '$lib/api/types';

	let designId: string = $page.params.id || '';
	let showModal = false;

	onMount(async () => {
		if (designId) {
			await systemDesigns.loadOne(designId);
		}
	});

	async function handleSubmit(data: UpdateSystemDesignRequest) {
		try {
			await systemDesigns.updateSystemDesign(designId, data);
		} catch (err) {
			console.error('Failed to update system design:', err);
		}
	}

	function handleDelete() {
		if (confirm('Are you sure you want to delete this system design?')) {
			systemDesigns.deleteSystemDesign(designId).then(() => {
				goto('/system-designs');
			});
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="space-y-6 px-4 py-6 sm:px-0">
			{#if $systemDesigns.currentSystemDesign}
				<div>
					<button
						on:click={() => goto('/system-designs')}
						class="mb-4 font-medium text-blue-600 hover:text-blue-900"
					>
						← Back to Designs
					</button>
					<div class="flex items-start justify-between">
						<h1 class="text-3xl font-bold text-gray-900">
							{$systemDesigns.currentSystemDesign.title}
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
						<SystemDesignEditor
							initialData={$systemDesigns.currentSystemDesign}
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

						{#if $systemDesigns.currentSystemDesign.featured}
							<div class="rounded-lg border border-blue-200 bg-blue-50 p-4">
								<p class="text-sm text-blue-900">
									<strong>⭐ Featured</strong><br />
									This design is featured in your portfolio
								</p>
							</div>
						{/if}
					</div>
				</div>

				<GenerationModal
					contentId={designId}
					domainType="system-design"
					title="Generate Creative Assets"
					description="Generate professional images for your system design"
				/>
			{:else}
				<div class="rounded-lg bg-white p-6 text-center shadow">
					<p class="text-gray-500">System design not found</p>
				</div>
			{/if}
		</div>
	</div>
</div>
