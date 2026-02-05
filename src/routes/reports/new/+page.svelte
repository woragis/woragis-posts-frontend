<script lang="ts">
	import { goto } from '$app/navigation';
	import { ReportEditor } from '$lib/components/reports';
	import { reports } from '$lib/stores/reports';
	import type { CreateReportRequest } from '$lib/api/types';

	async function handleSubmit(data: CreateReportRequest) {
		try {
			await reports.createReport(data);
			await goto('/reports');
		} catch (err) {
			console.error('Failed to create report:', err);
		}
	}
</script>

<div class="min-h-screen bg-gray-50 py-8">
	<div class="mx-auto max-w-2xl px-4">
		<div class="mb-8">
			<a href="/reports" class="text-sm font-medium text-blue-600 hover:text-blue-700">
				← Back to Reports
			</a>
			<h1 class="mt-4 text-3xl font-bold text-gray-900">Create New Report</h1>
		</div>

		<div class="rounded-lg bg-white p-8 shadow">
			<ReportEditor initialData={undefined} onSubmit={handleSubmit} />
		</div>
	</div>
</div>
