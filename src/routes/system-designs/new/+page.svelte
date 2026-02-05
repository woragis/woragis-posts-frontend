<script lang="ts">
	import { goto } from '$app/navigation';
	import { systemDesigns } from '$lib/stores/system-designs';
	import { SystemDesignEditor } from '$lib/components/system-designs';
	import type { CreateSystemDesignRequest } from '$lib/api/types';

	async function handleSubmit(data: CreateSystemDesignRequest) {
		try {
			await systemDesigns.createSystemDesign(data);
			await goto('/system-designs');
		} catch (err) {
			console.error('Failed to create system design:', err);
		}
	}
</script>

<div class="min-h-screen bg-gray-50">
	<div class="mx-auto max-w-4xl py-6 sm:px-6 lg:px-8">
		<div class="px-4 py-6 sm:px-0">
			<div class="mb-8">
				<button
					on:click={() => goto('/system-designs')}
					class="mb-4 font-medium text-blue-600 hover:text-blue-900"
				>
					← Back to Designs
				</button>
				<h1 class="text-3xl font-bold text-gray-900">New System Design</h1>
			</div>

			<SystemDesignEditor onSubmit={handleSubmit} />
		</div>
	</div>
</div>
