<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { loadProblemSolutionPublic, problemSolutions, clearCurrentProblemSolution } from '$lib/stores/problem-solutions';
	import { ProblemSolutionView } from '$lib/components/problem-solutions';

	onMount(async () => {
		const id = $page.params.id || '';
		// Try to load by ID
		if (id) {
			await loadProblemSolutionPublic(id);
		}
	});

	onMount(() => {
		return () => {
			clearCurrentProblemSolution();
		};
	});
</script>

<svelte:head>
	<title>{$problemSolutions.currentProblemSolution?.problem || 'Problem Solution'}</title>
</svelte:head>

<ProblemSolutionView
	problemSolution={$problemSolutions.currentProblemSolution}
	isLoading={$problemSolutions.isLoadingCurrent}
/>
