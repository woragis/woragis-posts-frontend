import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { Report, CreateReportRequest, UpdateReportRequest } from '../types';

class ReportsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/reports`);
	}

	async listReports() {
		return this.client.get<Report[]>('/');
	}

	async getReport(id: string) {
		return this.getById<Report>(id);
	}

	async createReport(data: CreateReportRequest) {
		return this.create<Report>(data);
	}

	async updateReport(id: string, data: UpdateReportRequest) {
		return this.update<Report>(id, data);
	}

	async deleteReport(id: string) {
		return this.delete(id);
	}

	async toggleFavorite(id: string, favorite: boolean) {
		return this.client.post<{ isFavorite: boolean }>(`/favorite`, {
			definition_id: id,
			favorite
		});
	}

	async archiveReports(ids: string[]) {
		return this.client.post('/archive', { definition_ids: ids });
	}

	async restoreReports(ids: string[]) {
		return this.client.post('/restore', { definition_ids: ids });
	}

	async deleteReports(ids: string[]) {
		return this.client.post('/delete', { definition_ids: ids });
	}
}

export const reportsClient = new ReportsApiClient();
export { ReportsApiClient };
