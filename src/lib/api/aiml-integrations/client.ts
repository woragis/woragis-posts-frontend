import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type {
	AimlIntegration,
	CreateAimlIntegrationRequest,
	UpdateAimlIntegrationRequest
} from '../types';

class AimlIntegrationsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/aiml-integrations`);
	}

	async listIntegrations(): Promise<AimlIntegration[]> {
		const response = await this.client.get<AimlIntegration[]>('/');
		return response.data || [];
	}

	async getFeatured(): Promise<AimlIntegration[]> {
		const response = await this.client.get<AimlIntegration[]>('/featured');
		return response.data || [];
	}

	async getIntegration(id: string): Promise<AimlIntegration> {
		return this.getById<AimlIntegration>(id);
	}

	async createIntegration(data: CreateAimlIntegrationRequest): Promise<AimlIntegration> {
		return this.create<AimlIntegration>(data);
	}

	async updateIntegration(
		id: string,
		data: UpdateAimlIntegrationRequest
	): Promise<AimlIntegration> {
		return this.update<AimlIntegration>(id, data);
	}

	async deleteIntegration(id: string): Promise<void> {
		await this.delete(id);
	}

	async getByType(type: string): Promise<AimlIntegration[]> {
		const response = await this.client.get<AimlIntegration[]>(`/type/${type}`);
		return response.data || [];
	}

	async getByFramework(framework: string): Promise<AimlIntegration[]> {
		const response = await this.client.get<AimlIntegration[]>(`/framework/${framework}`);
		return response.data || [];
	}

	async getByProject(projectId: string): Promise<AimlIntegration[]> {
		const response = await this.client.get<AimlIntegration[]>(`/project/${projectId}`);
		return response.data || [];
	}
}

export const aimlIntegrationsClient = new AimlIntegrationsApiClient();
export { AimlIntegrationsApiClient };
