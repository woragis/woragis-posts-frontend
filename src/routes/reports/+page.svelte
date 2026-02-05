<script lang="ts">
	import { onMount } from 'svelte';
	import { ReportsList } from '$lib/components/reports';
	import { reports } from '$lib/stores/reports';

	onMount(async () => {
		try {
			await reports.loadReports();
		} catch (err) {
			console.error('Failed to load reports:', err);
		}
	});
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-4">
		<ReportsList />
	</div>
</div>
