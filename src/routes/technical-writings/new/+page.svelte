<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { auth } from '$lib';
	import { technicalWritings } from '$lib/stores/technical-writings';
	import { TechnicalWritingEditor } from '$lib/components/technical-writings';
	import type {
		CreateTechnicalWritingRequest,
		UpdateTechnicalWritingRequest
	} from '$lib/api/types';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
		}
	});

	async function handleSubmit(data: CreateTechnicalWritingRequest | UpdateTechnicalWritingRequest) {
		try {
			const writing = await technicalWritings.createWriting(data as CreateTechnicalWritingRequest);
			await goto(`/technical-writings/${writing.id}/edit`);
		} catch (err) {
			console.error('Failed to create writing:', err);
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="mb-8">
				<button
					on:click={() => goto('/technical-writings')}
					class="mb-4 font-medium text-blue-600 hover:text-blue-900"
				>
					← Back to Writings
				</button>
				<h1 class="text-3xl font-bold text-gray-900">New Technical Writing</h1>
			</div>

			<TechnicalWritingEditor onSubmit={handleSubmit} />
		</div>
	</div>
</div>
