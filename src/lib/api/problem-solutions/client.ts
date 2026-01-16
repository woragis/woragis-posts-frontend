import { BaseApiClient } from '../base-client';
import type { ProblemSolution } from '../types';

class ProblemSolutionsApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/problem-solutions`);
	}
}

export const problemSolutionsClient = new ProblemSolutionsApiClient();
export { ProblemSolutionsApiClient };
