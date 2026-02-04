<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import { ProblemSolutionEditor } from '$lib/components/problem-solutions';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}
	});

	async function handleSave() {
		// Navigate back to list after save
		await goto('/problem-solutions');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<ProblemSolutionEditor onSave={handleSave} />
		</div>
	</div>
</div>
