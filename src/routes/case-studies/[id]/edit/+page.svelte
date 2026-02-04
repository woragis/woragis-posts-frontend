<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import { loadCaseStudy, caseStudies, clearCurrentCaseStudy } from '$lib/stores/case-studies';
	import { CaseStudyEditor } from '$lib/components/case-studies';
	import { GenerationModal, ProgressIndicator } from '$lib/components/assets';

	let showAssetModal = false;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		const id = $page.params.id || '';
		if (id) {
			await loadCaseStudy(id);
		}
	});

	async function handleSave() {
		// Show creative assets generation modal
		showAssetModal = true;
	}

	function handleCloseModal() {
		showAssetModal = false;
		// Optionally navigate back
		goto('/case-studies');
	}

	onMount(() => {
		return () => {
			clearCurrentCaseStudy();
		};
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			{#if $caseStudies.isLoadingCurrent}
				<div class="text-center">
					<p class="text-gray-500">Loading case study...</p>
				</div>
			{:else if $caseStudies.currentCaseStudy}
				<div class="space-y-6">
					<CaseStudyEditor caseStudy={$caseStudies.currentCaseStudy} onSave={handleSave} />

					{#if showAssetModal && $caseStudies.currentCaseStudy}
						<GenerationModal
							contentId={$caseStudies.currentCaseStudy.id}
							domainType="case-study"
							title="Generate Creative Assets"
							description="Generate professional images for your case study"
							onClose={handleCloseModal}
						/>
					{/if}
				</div>
			{:else}
				<div class="rounded-lg bg-white p-6 text-center shadow">
					<p class="text-gray-500">Case study not found</p>
				</div>
			{/if}
		</div>
	</div>
</div>
