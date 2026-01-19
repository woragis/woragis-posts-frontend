import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { CaseStudy } from '../types';

class CaseStudiesApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/case-studies`);
	}
}

export const caseStudiesClient = new CaseStudiesApiClient();
export { CaseStudiesApiClient };
