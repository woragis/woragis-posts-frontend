import { BaseApiClient } from '../base-client';
import type { CaseStudy } from '../types';

class CaseStudiesApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/case-studies`);
	}
}

export const caseStudiesClient = new CaseStudiesApiClient();
export { CaseStudiesApiClient };
