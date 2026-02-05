import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type {
	TechnicalWriting,
	CreateTechnicalWritingRequest,
	UpdateTechnicalWritingRequest,
	WritingType,
	WritingPublicationPlatform
} from '../types';

interface WritingFilters {
	type?: WritingType;
	platform?: WritingPublicationPlatform;
	projectId?: string;
	featured?: boolean;
	limit?: number;
	offset?: number;
}

class TechnicalWritingsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/technical-writings`);
	}

	async createWriting(req: CreateTechnicalWritingRequest): Promise<TechnicalWriting> {
		return this.create<TechnicalWriting>(req);
	}

	async listWritings(filters?: WritingFilters): Promise<TechnicalWriting[]> {
		const params = new URLSearchParams();
		if (filters?.type) params.append('type', filters.type);
		if (filters?.platform) params.append('platform', filters.platform);
		if (filters?.projectId) params.append('projectId', filters.projectId);
		if (filters?.featured !== undefined) params.append('featured', String(filters.featured));
		if (filters?.limit) params.append('limit', String(filters.limit));
		if (filters?.offset) params.append('offset', String(filters.offset));

		const query = params.toString() ? `?${params.toString()}` : '';
		const response = await this.client.get<{ data: TechnicalWriting[] }>(`/${query}`);
		return response.data.data;
	}

	async listFeatured(): Promise<TechnicalWriting[]> {
		const response = await this.client.get<{ data: TechnicalWriting[] }>('/featured');
		return response.data.data;
	}

	async getWriting(id: string): Promise<TechnicalWriting> {
		return this.getById<TechnicalWriting>(id);
	}

	async getPublic(id: string): Promise<TechnicalWriting> {
		const response = await this.client.get<{ data: TechnicalWriting }>(`/${id}/public`);
		return response.data.data;
	}

	async updateWriting(id: string, req: UpdateTechnicalWritingRequest): Promise<TechnicalWriting> {
		return this.update<TechnicalWriting>(id, req);
	}

	async deleteWriting(id: string): Promise<void> {
		return this.delete(id);
	}

	async searchWritings(query: string): Promise<TechnicalWriting[]> {
		const response = await this.client.get<{ data: TechnicalWriting[] }>(
			`/search?q=${encodeURIComponent(query)}`
		);
		return response.data.data;
	}

	async getByType(type: WritingType): Promise<TechnicalWriting[]> {
		const response = await this.client.get<{ data: TechnicalWriting[] }>(`/type/${type}`);
		return response.data.data;
	}

	async getByPlatform(platform: WritingPublicationPlatform): Promise<TechnicalWriting[]> {
		const response = await this.client.get<{ data: TechnicalWriting[] }>(`/platform/${platform}`);
		return response.data.data;
	}

	async getByProject(projectId: string): Promise<TechnicalWriting[]> {
		const response = await this.client.get<{ data: TechnicalWriting[] }>(`/project/${projectId}`);
		return response.data.data;
	}
}

export const technicalWritingsClient = new TechnicalWritingsApiClient();
export { TechnicalWritingsApiClient };
