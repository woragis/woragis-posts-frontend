import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { ImpactMetric, CreateImpactMetricRequest, UpdateImpactMetricRequest } from '../types';

class ImpactMetricsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/impact-metrics`);
	}

	async listMetrics() {
		return this.client.get<ImpactMetric[]>('/');
	}

	async getFeatured() {
		return this.client.get<ImpactMetric[]>('/featured');
	}

	async getMetric(id: string) {
		return this.getById<ImpactMetric>(id);
	}

	async createMetric(data: CreateImpactMetricRequest) {
		return this.create<ImpactMetric>(data);
	}

	async updateMetric(id: string, data: UpdateImpactMetricRequest) {
		return this.update<ImpactMetric>(id, data);
	}

	async deleteMetric(id: string) {
		return this.delete(id);
	}

	async getDashboard() {
		return this.client.get<any>('/dashboard');
	}

	async getByType(type: string) {
		return this.client.get<ImpactMetric[]>(`/type/${type}`);
	}

	async getTotalByType(type: string) {
		return this.client.get<{ total: number }>(`/type/${type}/total`);
	}

	async getByEntity(entityType: string, entityId: string) {
		return this.client.get<ImpactMetric[]>(`/entity/${entityType}/${entityId}`);
	}
}

export const impactMetricsClient = new ImpactMetricsApiClient();
export { ImpactMetricsApiClient };
