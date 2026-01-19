import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { TechnicalWriting } from '../types';

class TechnicalWritingsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/technical-writings`);
	}
}

export const technicalWritingsClient = new TechnicalWritingsApiClient();
export { TechnicalWritingsApiClient };
