<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import { loadProblemSolutions } from '$lib/stores/problem-solutions';
	import { ProblemSolutionsList } from '$lib/components/problem-solutions';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		await loadProblemSolutions();
	});

	function handleCreateClick() {
		goto('/problem-solutions/new');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="flex justify-between items-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Problem Solutions</h1>
				<button
					on:click={handleCreateClick}
					class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
				>
					New Problem Solution
				</button>
			</div>

			<ProblemSolutionsList />
		</div>
	</div>
</div>
