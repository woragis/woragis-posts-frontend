<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		loadCaseStudyBySlug,
		caseStudies,
		clearCurrentCaseStudy
	} from '$lib/stores/case-studies';
	import { CaseStudyView } from '$lib/components/case-studies';

	onMount(async () => {
		const slug = $page.params.id || '';
		// Try to load by slug first, then by id
		if (slug) {
			await loadCaseStudyBySlug(slug);
		}
	});

	onMount(() => {
		return () => {
			clearCurrentCaseStudy();
		};
	});
</script>

<svelte:head>
	<title>{$caseStudies.currentCaseStudy?.title || 'Case Study'}</title>
</svelte:head>

<CaseStudyView
	caseStudy={$caseStudies.currentCaseStudy}
	isLoading={$caseStudies.isLoadingCurrent}
/>
