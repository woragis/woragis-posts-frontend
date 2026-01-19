import { BaseApiClient } from '../base-client';
import type {
	Publication,
	PublicationPlatform,
	PublicationMedia,
	Platform,
	CreatePublicationRequest,
	UpdatePublicationRequest,
	PublishRequest,
	BulkPublishRequest,
	CreatePlatformRequest,
	PublicationFilter,
	PaginatedApiResponse
} from '../types';
import type { ApiResponse } from '../utils';

/**
 * Publications API Client
 * Handles multi-platform publishing management
 */
class PublicationsApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/api/v1/publications`);
	}

	// ===== Publications CRUD =====

	async createPublication(data: CreatePublicationRequest): Promise<Publication> {
		const response = await this.client.post<ApiResponse<Publication>>('/', data);
		return response.data.data!;
	}

	async listPublications(filter?: PublicationFilter): Promise<PaginatedApiResponse<Publication>> {
		const params: any = {};
		if (filter?.status) params.status = filter.status;
		if (filter?.contentType) params.contentType = filter.contentType;
		if (filter?.isArchived !== undefined) params.isArchived = filter.isArchived;
		params.limit = filter?.limit || 20;
		params.offset = filter?.offset || 0;

		const response = await this.client.get<PaginatedApiResponse<Publication>>('/', {
			params
		});
		return response.data;
	}

	async getPublication(id: string): Promise<Publication> {
		const response = await this.client.get<ApiResponse<Publication>>(`/${id}`);
		return response.data.data!;
	}

	async updatePublication(id: string, data: UpdatePublicationRequest): Promise<Publication> {
		const response = await this.client.put<ApiResponse<Publication>>(`/${id}`, data);
		return response.data.data!;
	}

	async deletePublication(id: string): Promise<void> {
		await this.client.delete(`/${id}`);
	}

	// ===== Platforms Management =====

	async listPlatforms(): Promise<Platform[]> {
		const response = await this.client.get<ApiResponse<Platform[]>>('/platforms');
		return response.data.data || [];
	}

	async createPlatform(data: CreatePlatformRequest): Promise<Platform> {
		const response = await this.client.post<ApiResponse<Platform>>('/platforms', data);
		return response.data.data!;
	}

	// ===== Publishing =====

	async publishToplatform(
		publicationId: string,
		platformId: string,
		data?: PublishRequest
	): Promise<PublicationPlatform> {
		const response = await this.client.post<ApiResponse<PublicationPlatform>>(
			`/${publicationId}/publish/${platformId}`,
			data || {}
		);
		return response.data.data!;
	}

	async unpublishFromPlatform(publicationId: string, platformId: string): Promise<void> {
		await this.client.delete(`/${publicationId}/publish/${platformId}`);
	}

	async listPublicationPlatforms(publicationId: string): Promise<PublicationPlatform[]> {
		const response = await this.client.get<ApiResponse<PublicationPlatform[]>>(
			`/${publicationId}/publish`
		);
		return response.data.data || [];
	}

	async retryPublish(publicationId: string, platformId: string): Promise<PublicationPlatform> {
		const response = await this.client.post<ApiResponse<PublicationPlatform>>(
			`/${publicationId}/publish/${platformId}/retry`
		);
		return response.data.data!;
	}

	async bulkPublish(
		publicationId: string,
		data: BulkPublishRequest
	): Promise<PublicationPlatform[]> {
		const response = await this.client.post<ApiResponse<PublicationPlatform[]>>(
			`/${publicationId}/publish/bulk`,
			data
		);
		return response.data.data || [];
	}

	// ===== Media Management =====

	async uploadMedia(
		publicationId: string,
		platformId: string,
		mediaType: string,
		file: File
	): Promise<PublicationMedia> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('platformId', platformId);
		formData.append('mediaType', mediaType);

		const response = await this.client.post<ApiResponse<PublicationMedia>>(
			`/${publicationId}/media`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		);
		return response.data.data!;
	}

	async listPublicationMedia(publicationId: string): Promise<PublicationMedia[]> {
		const response = await this.client.get<ApiResponse<PublicationMedia[]>>(
			`/${publicationId}/media`
		);
		return response.data.data || [];
	}

	async deleteMedia(publicationId: string, mediaId: string): Promise<void> {
		await this.client.delete(`/${publicationId}/media/${mediaId}`);
	}
}

export const publicationsClient = new PublicationsApiClient();
export { PublicationsApiClient };
