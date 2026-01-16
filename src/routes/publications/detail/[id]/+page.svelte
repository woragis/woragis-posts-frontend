<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { publicationsClient } from '$lib/api/publications/client';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import type { Publication, Platform, PublicationPlatform } from '$lib/api/types';

	let publication: Publication | null = null;
	let platforms: Platform[] = [];
	let publishedPlatforms: PublicationPlatform[] = [];
	let isLoading = true;
	let error = '';
	let showPublishModal = false;
	let selectedPlatformId = '';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		const pubId = $page.params.id;
		if (!pubId) {
			error = 'Publication ID not found';
			isLoading = false;
			return;
		}

		await Promise.all([
			loadPublication(pubId),
			loadPlatforms(),
			loadPublishedPlatforms(pubId)
		]);
	});

	async function loadPublication(id: string) {
		try {
			publication = await publicationsClient.getPublication(id);
		} catch (err: any) {
			error = err.message || 'Failed to load publication';
		}
	}

	async function loadPlatforms() {
		try {
			platforms = await publicationsClient.listPlatforms();
		} catch (err: any) {
			error = err.message || 'Failed to load platforms';
		} finally {
			isLoading = false;
		}
	}

	async function loadPublishedPlatforms(pubId: string) {
		try {
			publishedPlatforms = await publicationsClient.listPublicationPlatforms(pubId);
		} catch (err: any) {
			console.error('Failed to load published platforms', err);
		}
	}

	function openPublishModal(platformId: string) {
		selectedPlatformId = platformId;
		showPublishModal = true;
	}

	function closePublishModal() {
		showPublishModal = false;
		selectedPlatformId = '';
	}

	async function handlePublish() {
		if (!publication || !selectedPlatformId) return;

		try {
			await publicationsClient.publishToplatform(publication.id, selectedPlatformId);
			await loadPublishedPlatforms(publication.id);
			closePublishModal();
		} catch (err: any) {
			error = err.message || 'Failed to publish';
		}
	}

	async function handleUnpublish(platformId: string) {
		if (!publication) return;

		if (!confirm('Are you sure you want to unpublish from this platform?')) {
			return;
		}

		try {
			await publicationsClient.unpublishFromPlatform(publication.id, platformId);
			await loadPublishedPlatforms(publication.id);
		} catch (err: any) {
			error = err.message || 'Failed to unpublish';
		}
	}

	async function handleRetry(platformId: string) {
		if (!publication) return;

		try {
			await publicationsClient.retryPublish(publication.id, platformId);
			await loadPublishedPlatforms(publication.id);
		} catch (err: any) {
			error = err.message || 'Failed to retry publish';
		}
	}

	function getStatusBadgeColor(status: string): string {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'publishing':
				return 'bg-blue-100 text-blue-800';
			case 'published':
				return 'bg-green-100 text-green-800';
			case 'failed':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}

	function getUnpublishedPlatforms(): Platform[] {
		const publishedIds = new Set(publishedPlatforms.map((p) => p.platformId));
		return platforms.filter((p) => !publishedIds.has(p.id) && p.isActive);
	}
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
	<div class="mb-6">
		<button
			on:click={() => goto('/publications')}
			class="text-blue-600 hover:text-blue-800 font-medium"
		>
			← Back to Publications
		</button>
	</div>

	{#if error}
		<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
			{error}
		</div>
	{/if}

	{#if isLoading}
		<div class="text-center py-8">
			<div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
		</div>
	{:else if publication}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Main Content -->
			<div class="lg:col-span-2">
				<!-- Publication Info -->
				<div class="bg-white rounded-lg shadow p-6 mb-6">
					<div class="flex justify-between items-start mb-4">
						<div>
							<h1 class="text-3xl font-bold">{publication.title}</h1>
							<p class="text-gray-600 mt-2">{publication.outline || 'No outline provided'}</p>
						</div>
						<button
							on:click={() => goto(`/publications/${publication.id}`)}
							class="text-blue-600 hover:text-blue-800 font-medium"
						>
							Edit
						</button>
					</div>

					<div class="border-t pt-4">
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<p class="text-gray-600">Content Type</p>
								<p class="font-medium">{publication.contentType.replace(/_/g, ' ')}</p>
							</div>
							<div>
								<p class="text-gray-600">Status</p>
								<p class="font-medium">{publication.status}</p>
							</div>
							<div>
								<p class="text-gray-600">Created</p>
								<p class="font-medium">{new Date(publication.createdAt).toLocaleDateString()}</p>
							</div>
							<div>
								<p class="text-gray-600">Updated</p>
								<p class="font-medium">{new Date(publication.updatedAt).toLocaleDateString()}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Published Platforms -->
				<div class="bg-white rounded-lg shadow p-6">
					<h2 class="text-xl font-bold mb-4">Published Platforms ({publishedPlatforms.length})</h2>

					{#if publishedPlatforms.length === 0}
						<p class="text-gray-500">Not published anywhere yet</p>
					{:else}
						<div class="space-y-4">
							{#each publishedPlatforms as pubPlatform (pubPlatform.id)}
								<div class="border rounded-lg p-4">
									<div class="flex justify-between items-start">
										<div class="flex-1">
											<h3 class="font-semibold">{pubPlatform.platform?.name || 'Unknown'}</h3>
											<span
												class={`inline-block px-2 py-1 rounded text-xs font-medium mt-2 ${getStatusBadgeColor(pubPlatform.status)}`}
											>
												{pubPlatform.status}
											</span>
											{#if pubPlatform.publishedUrl}
												<p class="text-sm text-blue-600 mt-2">
													<a href={pubPlatform.publishedUrl} target="_blank" rel="noopener noreferrer">
														View on {pubPlatform.platform?.name}
													</a>
												</p>
											{/if}
										</div>
										<div class="flex gap-2">
											{#if pubPlatform.status === 'failed'}
												<button
													on:click={() => handleRetry(pubPlatform.platformId)}
													class="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white text-sm rounded"
												>
													Retry
												</button>
											{/if}
											<button
												on:click={() => handleUnpublish(pubPlatform.platformId)}
												class="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded"
											>
												Unpublish
											</button>
										</div>
									</div>
									{#if pubPlatform.publishedAt}
										<p class="text-xs text-gray-500 mt-2">
											Published: {new Date(pubPlatform.publishedAt).toLocaleString()}
										</p>
									{/if}
									{#if pubPlatform.retryCount > 0}
										<p class="text-xs text-gray-500">
											Retry attempts: {pubPlatform.retryCount}
										</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Sidebar -->
			<div class="lg:col-span-1">
				<!-- Publish Card -->
				<div class="bg-white rounded-lg shadow p-6 sticky top-4">
					<h2 class="text-lg font-bold mb-4">Publish to Platforms</h2>

					{#if getUnpublishedPlatforms().length === 0}
						<p class="text-sm text-gray-500">
							All available platforms are already published or inactive
						</p>
					{:else}
						<div class="space-y-2">
							{#each getUnpublishedPlatforms() as platform (platform.id)}
								<button
									on:click={() => openPublishModal(platform.id)}
									class="w-full text-left px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm"
								>
									<div class="flex items-center gap-2">
										{#if platform.icon}
											<span class="text-lg">{platform.icon}</span>
										{/if}
										<span>{platform.name}</span>
									</div>
								</button>
							{/each}
						</div>
					{/if}
				</div>
			</div>
		</div>

		<!-- Publish Modal -->
		{#if showPublishModal}
			<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
				<div class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
					<h2 class="text-xl font-bold mb-4">Publish to Platform</h2>

					<p class="text-gray-600 mb-4">
						Publish "{publication.title}" to{' '}
						<strong>{platforms.find((p) => p.id === selectedPlatformId)?.name}</strong>?
					</p>

					<div class="flex gap-4">
						<button
							on:click={closePublishModal}
							class="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							on:click={handlePublish}
							class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
						>
							Publish
						</button>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	:global(body) {
		background-color: #f9fafb;
	}
</style>
