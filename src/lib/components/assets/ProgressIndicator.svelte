<script lang="ts">
	export let progress: number = 0;
	export let status: 'idle' | 'pending' | 'processing' | 'completed' | 'failed' = 'pending';
	export let error: string | null = null;

	$: statusLabel = {
		idle: 'Ready',
		pending: 'Waiting...',
		processing: 'Generating...',
		completed: 'Complete!',
		failed: 'Failed'
	}[status];

	$: statusColor = {
		idle: 'bg-gray-300',
		pending: 'bg-gray-200',
		processing: 'bg-blue-500',
		completed: 'bg-green-500',
		failed: 'bg-red-500'
	}[status];
</script>

<div class="space-y-2">
	<!-- Progress Bar -->
	<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
		<div
			class="h-full transition-all duration-300 {statusColor}"
			style="width: {Math.min(100, progress)}%"
		></div>
	</div>

	<!-- Status Text -->
	<div class="flex items-center justify-between text-sm">
		<span class="text-gray-600">{statusLabel}</span>
		<span class="font-semibold text-gray-700">{progress}%</span>
	</div>

	<!-- Error Message -->
	{#if error && status === 'failed'}
		<div class="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
			{error}
		</div>
	{/if}
</div>

<style>
	:global(.progress-bar) {
		transition: width 0.3s ease-in-out;
	}
</style>
