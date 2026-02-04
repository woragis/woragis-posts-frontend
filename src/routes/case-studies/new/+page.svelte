<script lang="ts">
	import { onMount } from 'svelte';
	import { auth } from '$lib';
	import { goto } from '$app/navigation';
	import { CaseStudyEditor } from '$lib/components/case-studies';

	onMount(async () => {
		if (!$auth.isAuthenticated) {
			await goto('/auth/login');
			return;
		}
	});

	async function handleSave() {
		// Navigate back to list after save
		await goto('/case-studies');
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<CaseStudyEditor onSave={handleSave} />
		</div>
	</div>
</div>
