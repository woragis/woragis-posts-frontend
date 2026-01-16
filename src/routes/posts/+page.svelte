<script lang="ts">
	import { onMount } from 'svelte';
	import { postsClient, auth } from '$lib';
	import { goto } from '$app/navigation';

	interface PostWithMetadata {
		id: string;
		slug: string;
		title: string;
		excerpt?: string;
		createdAt: string;
		status: string;
	}

	let posts: PostWithMetadata[] = [];
	let isLoading = true;
	let error = '';
	let currentPage = 1;
	let totalPages = 1;

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		await loadPosts();
	});

	async function loadPosts() {
		isLoading = true;
		error = '';

		try {
			const response = await postsClient.listPosts(currentPage, 10);
			posts = (response.data || []) as PostWithMetadata[];
			// Assume pagination info in response
			totalPages = Math.ceil((response.meta?.total || 0) / 10);
		} catch (err: any) {
			error = err.message || 'Failed to load posts';
		} finally {
			isLoading = false;
		}
	}

	function nextPage() {
		if (currentPage < totalPages) {
			currentPage++;
			loadPosts();
		}
	}

	function prevPage() {
		if (currentPage > 1) {
			currentPage--;
			loadPosts();
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="flex justify-between items-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Posts</h1>
				<a
					href="/posts/new"
					class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
				>
					New Post
				</a>
			</div>

			{#if error}
				<div class="rounded-md bg-red-50 p-4 mb-4">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}

			{#if isLoading}
				<p class="text-gray-500">Loading posts...</p>
			{:else if posts.length === 0}
				<div class="text-center py-12">
					<p class="text-gray-500 mb-4">No posts yet</p>
					<a
						href="/posts/new"
						class="text-blue-600 hover:text-blue-500">Create your first post</a
					>
				</div>
			{:else}
				<div class="bg-white shadow overflow-hidden sm:rounded-md">
					<ul class="divide-y divide-gray-200">
						{#each posts as post (post.id)}
							<li>
								<a
									href={`/posts/${post.slug}`}
									class="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center"
								>
									<div class="min-w-0 flex-1">
										<p class="text-sm font-medium text-gray-900 truncate">{post.title}</p>
										<p class="text-sm text-gray-500">{post.excerpt}</p>
										<p class="text-xs text-gray-400 mt-1">
											Created {new Date(post.createdAt).toLocaleDateString()}
										</p>
									</div>
									<div>
										<span
											class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
												post.status === 'published'
													? 'bg-green-100 text-green-800'
													: 'bg-yellow-100 text-yellow-800'
											}`}
										>
											{post.status}
										</span>
									</div>
								</a>
							</li>
						{/each}
					</ul>
				</div>

				<div class="flex justify-between items-center mt-6">
					<button
						on:click={prevPage}
						disabled={currentPage === 1}
						class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
					>
						Previous
					</button>

					<span class="text-sm text-gray-700">
						Page {currentPage} of {totalPages}
					</span>

					<button
						on:click={nextPage}
						disabled={currentPage === totalPages}
						class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
					>
						Next
					</button>
				</div>
			{/if}
		</div>
	</div>
</div>
