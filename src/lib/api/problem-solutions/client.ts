import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { ProblemSolution } from '../types';

class ProblemSolutionsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/problem-solutions`);
	}
}

export const problemSolutionsClient = new ProblemSolutionsApiClient();
export { ProblemSolutionsApiClient };
