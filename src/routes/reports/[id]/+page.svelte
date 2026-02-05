<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ReportView } from '$lib/components/reports';
	import { reports } from '$lib/stores/reports';

	onMount(async () => {
		try {
			const reportId = $page.params.id;
			if (reportId) {
				await reports.loadOne(reportId);
			}
		} catch (err) {
			console.error('Failed to load report:', err);
		}
	});
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-4xl px-4">
		<a
			href="/reports"
			class="mb-8 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
		>
			← Back to Reports
		</a>

		<div class="rounded-lg bg-white p-8 shadow">
			<ReportView report={$reports.currentReport} />
		</div>
	</div>
</div>
