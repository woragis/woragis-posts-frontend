<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import { loadProblemSolution, problemSolutions, clearCurrentProblemSolution } from '$lib/stores/problem-solutions';
	import { ProblemSolutionEditor } from '$lib/components/problem-solutions';
	import { GenerationModal } from '$lib/components/assets';

	let showAssetModal = false;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		const id = $page.params.id || '';
		if (id) {
			await loadProblemSolution(id);
		}
	});

	async function handleSave() {
		// Show creative assets generation modal
		showAssetModal = true;
	}

	function handleCloseModal() {
		showAssetModal = false;
		// Optionally navigate back
		goto('/problem-solutions');
	}

	onMount(() => {
		return () => {
			clearCurrentProblemSolution();
		};
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			{#if $problemSolutions.isLoadingCurrent}
				<div class="text-center">
					<p class="text-gray-500">Loading problem solution...</p>
				</div>
			{:else if $problemSolutions.currentProblemSolution}
				<div class="space-y-6">
					<ProblemSolutionEditor problemSolution={$problemSolutions.currentProblemSolution} onSave={handleSave} />

					{#if showAssetModal && $problemSolutions.currentProblemSolution}
						<GenerationModal
							contentId={$problemSolutions.currentProblemSolution.id}
							domainType="problem-solution"
							title="Generate Creative Assets"
							description="Generate professional images for your problem solution"
							onClose={handleCloseModal}
						/>
					{/if}
				</div>
			{:else}
				<div class="bg-white rounded-lg shadow p-6 text-center">
					<p class="text-gray-500">Problem solution not found</p>
				</div>
			{/if}
		</div>
	</div>
</div>
