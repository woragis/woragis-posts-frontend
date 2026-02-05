import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { SystemDesign, CreateSystemDesignRequest, UpdateSystemDesignRequest } from '../types';

class SystemDesignsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/system-designs`);
	}

	async createSystemDesign(req: CreateSystemDesignRequest): Promise<SystemDesign> {
		return this.create<SystemDesign>(req);
	}

	async listSystemDesigns(): Promise<SystemDesign[]> {
		const response = await this.client.get<{ data: SystemDesign[] }>('/');
		return response.data.data;
	}

	async listFeatured(): Promise<SystemDesign[]> {
		const response = await this.client.get<{ data: SystemDesign[] }>('/featured');
		return response.data.data;
	}

	async getSystemDesign(id: string): Promise<SystemDesign> {
		return this.getById<SystemDesign>(id);
	}

	async getPublic(id: string): Promise<SystemDesign> {
		const response = await this.client.get<{ data: SystemDesign }>(`/${id}/public`);
		return response.data.data;
	}

	async updateSystemDesign(id: string, req: UpdateSystemDesignRequest): Promise<SystemDesign> {
		return this.update<SystemDesign>(id, req);
	}

	async deleteSystemDesign(id: string): Promise<void> {
		await this.delete(id);
	}
}

export const systemDesignsClient = new SystemDesignsApiClient();
export { SystemDesignsApiClient };
