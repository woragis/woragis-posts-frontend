<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import { loadCaseStudies } from '$lib/stores/case-studies';
	import { CaseStudiesList } from '$lib/components/case-studies';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		await loadCaseStudies();
	});

	function handleCreateClick() {
		goto('/case-studies/new');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="mb-8 flex items-center justify-between">
				<h1 class="text-3xl font-bold text-gray-900">Case Studies</h1>
				<button
					on:click={handleCreateClick}
					class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
				>
					New Case Study
				</button>
			</div>

			<CaseStudiesList />
		</div>
	</div>
</div>
