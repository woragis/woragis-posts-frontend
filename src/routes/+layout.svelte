<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth, logoutUser, initializeAuth } from '$lib';

	let { children } = $props();
	let isMobileMenuOpen = false;

	onMount(async () => {
		// Initialize auth from cookies on page load
		await initializeAuth();
	});

	async function handleLogout() {
		try {
			await logoutUser();
			await goto('/auth/login');
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-screen bg-gray-50">
	<!-- Navigation -->
	<nav class="sticky top-0 z-40 bg-white shadow-sm">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-16 items-center justify-between">
				<div class="flex items-center space-x-8">
					<a href="/" class="text-xl font-bold text-gray-900">Posts</a>

					{#if $auth.isAuthenticated}
						<div class="hidden space-x-6 md:flex">
							<a href="/dashboard" class="text-sm font-medium text-gray-700 hover:text-gray-900">
								Dashboard
							</a>
							<a href="/posts" class="text-sm font-medium text-gray-700 hover:text-gray-900">
								Posts
							</a>
							<a
								href="/problem-solutions"
								class="text-sm font-medium text-gray-700 hover:text-gray-900"
							>
								Solutions
							</a>
							<a href="/case-studies" class="text-sm font-medium text-gray-700 hover:text-gray-900">
								Cases
							</a>
							<a
								href="/technical-writings"
								class="text-sm font-medium text-gray-700 hover:text-gray-900"
							>
								Writings
							</a>
						</div>
					{/if}
				</div>

				<div class="flex items-center space-x-4">
					{#if $auth.isAuthenticated}
						<div class="flex items-center space-x-3">
							<span class="text-sm text-gray-700">
								{$auth.user?.firstName}
								{$auth.user?.lastName}
							</span>
							<a href="/auth/profile" class="text-sm text-blue-600 hover:text-blue-500">
								Profile
							</a>
							<button onclick={handleLogout} class="text-sm text-blue-600 hover:text-blue-500">
								Logout
							</button>
						</div>
					{:else}
						<a href="/auth/login" class="text-sm text-blue-600 hover:text-blue-500"> Sign in </a>
					{/if}
				</div>
			</div>
		</div>
	</nav>

	<!-- Main Content -->
	<main>
		{@render children()}
	</main>
</div>

<style global>
	:global(html, body) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family:
			-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans',
			'Droid Sans', 'Helvetica Neue', sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
