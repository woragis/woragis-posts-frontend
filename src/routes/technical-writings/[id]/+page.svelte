<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { technicalWritings } from '$lib/stores/technical-writings';
	import { TechnicalWritingView } from '$lib/components/technical-writings';

	let writingId: string = $page.params.id || '';

	onMount(async () => {
		if (writingId) {
			await technicalWritings.loadPublic(writingId);
		}
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			{#if $technicalWritings.isLoading}
				<div class="py-12 text-center">
					<p class="text-gray-500">Loading...</p>
				</div>
			{:else if $technicalWritings.currentWriting}
				<TechnicalWritingView writing={$technicalWritings.currentWriting} />
			{:else}
				<div class="rounded-lg bg-white py-12 text-center shadow">
					<p class="text-gray-500">Writing not found</p>
				</div>
			{/if}
		</div>
	</div>
</div>
