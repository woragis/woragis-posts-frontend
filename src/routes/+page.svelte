<script lang="ts">
	import { onMount } from 'svelte';
	import { auth, initializeAuth } from '$lib';
	import { goto } from '$app/navigation';

	let isLoading = true;

	onMount(async () => {
		await initializeAuth();
		isLoading = false;

		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
		} else {
			await goto('/dashboard');
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center">
	{#if isLoading}
		<p class="text-gray-500">Loading...</p>
	{/if}
</div>
