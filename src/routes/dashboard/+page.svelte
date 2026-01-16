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
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<nav class="bg-white shadow-sm">
		<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
			<div class="flex justify-between items-center h-16">
				<div class="flex items-center">
					<h1 class="text-xl font-bold text-gray-900">Posts</h1>
				</div>
				<div class="flex items-center space-x-4">
					{#if $auth.user}
						<span class="text-sm text-gray-700">{$auth.user.firstName} {$auth.user.lastName}</span>
					{/if}
					<a href="/auth/profile" class="text-sm text-blue-600 hover:text-blue-500">Profile</a>
				</div>
			</div>
		</div>
	</nav>

	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		{#if isLoading}
			<p class="text-gray-500">Loading...</p>
		{:else}
			<div class="px-4 py-6 sm:px-0">
				<h2 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>

				<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<a
						href="/posts"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">Posts</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>

					<a
						href="/problem-solutions"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">Problem Solutions</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>

					<a
						href="/case-studies"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">Case Studies</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>

					<a
						href="/technical-writings"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">Technical Writings</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>
				</div>

				<div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
					<a
						href="/system-designs"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">System Designs</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>

					<a
						href="/reports"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">Reports</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>

					<a
						href="/impact-metrics"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">Impact Metrics</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>

					<a
						href="/aiml-integrations"
						class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition"
					>
						<div class="px-4 py-5 sm:p-6">
							<div class="flex items-center">
								<div>
									<dt class="text-sm font-medium text-gray-500">AI/ML Integrations</dt>
									<dd class="mt-1 text-3xl font-semibold text-gray-900">0</dd>
								</div>
							</div>
						</div>
					</a>
				</div>
			</div>
		{/if}
	</div>
</div>
