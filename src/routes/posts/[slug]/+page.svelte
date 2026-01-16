<script lang="ts">
	import { page } from '$app/stores';
	import { postsClient, auth } from '$lib';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let post: any = null;
	let isLoading = true;
	let error = '';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}

		const slug = $page.params.slug as string;

		try {
			post = await postsClient.getPostBySlug(slug);
		} catch (err: any) {
			error = err.message || 'Failed to load post';
		} finally {
			isLoading = false;
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<a href="/posts" class="text-blue-600 hover:text-blue-500 text-sm mb-4 block">← Back to Posts</a>

			{#if error}
				<div class="rounded-md bg-red-50 p-4 mb-4">
					<p class="text-sm text-red-700">{error}</p>
				</div>
			{/if}

			{#if isLoading}
				<p class="text-gray-500">Loading post...</p>
			{:else if post}
				<article>
					<header class="mb-8">
						<h1 class="text-4xl font-bold text-gray-900 mb-2">{post.title}</h1>
						<p class="text-gray-600 mb-4">{post.excerpt}</p>
						<div class="flex items-center space-x-4 text-sm text-gray-500">
							<span>Published {new Date(post.createdAt).toLocaleDateString()}</span>
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
					</header>

					{#if post.content}
						<div class="prose prose-sm max-w-none mb-8">
							{@html post.content}
						</div>
					{/if}

					{#if post.skills && post.skills.length > 0}
						<div class="mb-8">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Skills</h3>
							<div class="flex flex-wrap gap-2">
								{#each post.skills as skill}
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
										{skill.name}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					{#if post.categories && post.categories.length > 0}
						<div class="mb-8">
							<h3 class="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
							<div class="flex flex-wrap gap-2">
								{#each post.categories as category}
									<span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
										{category.name}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<div class="flex space-x-4">
						<a
							href={`/posts/${post.slug}/edit`}
							class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
						>
							Edit
						</a>
						<a href="/posts" class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
							Back
						</a>
					</div>
				</article>
			{/if}
		</div>
	</div>
</div>
