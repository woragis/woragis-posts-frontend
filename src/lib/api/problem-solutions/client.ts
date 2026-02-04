import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { ProblemSolution, CreateProblemSolutionRequest, UpdateProblemSolutionRequest } from '../types';

/**
 * Problem Solutions API Client
 */
class ProblemSolutionsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/problem-solutions`);
	}

	async createProblemSolution(data: CreateProblemSolutionRequest): Promise<ProblemSolution> {
		return this.create<ProblemSolution>(data);
	}

	async listProblemSolutions(page = 1, limit = 10) {
		const params = new URLSearchParams({ page: String(page), limit: String(limit) });
		const response = await this.client.get<any>(`/?${params.toString()}`);
		return response.data;
	}

	async listFeaturedProblemSolutions(page = 1, limit = 10) {
		const params = new URLSearchParams({ page: String(page), limit: String(limit) });
		const response = await this.client.get<any>(`/featured?${params.toString()}`);
		return response.data;
	}

	async getProblemSolution(id: string): Promise<ProblemSolution> {
		return this.getById<ProblemSolution>(id);
	}

	async getProblemSolutionPublic(id: string): Promise<ProblemSolution> {
		const response = await this.client.get<any>(`/${id}/public`);
		return response.data.data;
	}

	async updateProblemSolution(id: string, data: UpdateProblemSolutionRequest): Promise<ProblemSolution> {
		return this.update<ProblemSolution>(id, data);
	}

	async deleteProblemSolution(id: string): Promise<void> {
		return this.delete(id);
	}

	async getProblemSolutionMatrix(): Promise<any> {
		const response = await this.client.get<any>('/matrix');
		return response.data;
	}
}

export const problemSolutionsClient = new ProblemSolutionsApiClient();
export { ProblemSolutionsApiClient };
