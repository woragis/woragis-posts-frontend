import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { CaseStudy, CreateCaseStudyRequest, UpdateCaseStudyRequest } from '../types';

/**
 * Case Studies API Client
 */
class CaseStudiesApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/case-studies`);
	}

	async createCaseStudy(data: CreateCaseStudyRequest): Promise<CaseStudy> {
		return this.create<CaseStudy>(data);
	}

	async listCaseStudies(page = 1, limit = 10, status?: 'draft' | 'published' | 'archived') {
		const params = new URLSearchParams({ page: String(page), limit: String(limit) });
		if (status) {
			params.append('status', status);
		}
		const response = await this.client.get<any>(`/?${params.toString()}`);
		return response.data;
	}

	async searchCaseStudies(query: string, page = 1, limit = 10) {
		const params = new URLSearchParams({ q: query, page: String(page), limit: String(limit) });
		const response = await this.client.get<any>(`/search?${params.toString()}`);
		return response.data;
	}

	async getCaseStudyBySlug(slug: string): Promise<CaseStudy> {
		const response = await this.client.get<any>(`/slug/${slug}`);
		return response.data.data;
	}

	async getCaseStudy(id: string): Promise<CaseStudy> {
		return this.getById<CaseStudy>(id);
	}

	async updateCaseStudy(id: string, data: UpdateCaseStudyRequest): Promise<CaseStudy> {
		return this.update<CaseStudy>(id, data);
	}

	async deleteCaseStudy(id: string): Promise<void> {
		return this.delete(id);
	}

	async generateCaseStudyFromAI(data: {
		prompt: string;
	}): Promise<{ caseStudyId: string; status: string }> {
		const response = await this.client.post<any>('/generate-from-ai', data);
		return response.data;
	}
}

export const caseStudiesClient = new CaseStudiesApiClient();
export { CaseStudiesApiClient };
