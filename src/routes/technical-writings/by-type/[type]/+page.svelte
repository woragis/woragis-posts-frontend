<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { technicalWritings } from '$lib/stores/technical-writings';
	import { TechnicalWritingsList } from '$lib/components/technical-writings';
	import type { WritingType } from '$lib/api/types';

	let writingType: WritingType;

	onMount(async () => {
		writingType = $page.params.type as WritingType;
		await technicalWritings.loadByType(writingType);
	});
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="mb-8">
				<a
					href="/technical-writings"
					class="mb-4 inline-block font-medium text-blue-600 hover:text-blue-900"
				>
					← Back to All Writings
				</a>
				<h1 class="text-3xl font-bold text-gray-900 capitalize">
					{writingType ? writingType.replace('_', ' ') : 'Writings'} Writings
				</h1>
			</div>

			<TechnicalWritingsList />
		</div>
	</div>
</div>
