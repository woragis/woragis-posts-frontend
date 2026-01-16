<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';

	let items: any[] = [];
	let isLoading = true;
	let error = '';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		isLoading = false;
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<h1 class="text-3xl font-bold text-gray-900 mb-6">Problem Solutions</h1>

			{#if error}
				<div class="rounded-md bg-red-50 p-4 mb-4">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}

			{#if isLoading}
				<p class="text-gray-500">Loading...</p>
			{:else}
				<div class="bg-white rounded-lg shadow p-6 text-center">
					<p class="text-gray-500">Coming soon</p>
				</div>
			{/if}
		</div>
	</div>
</div>
