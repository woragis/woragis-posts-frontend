import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { Report } from '../types';

class ReportsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/reports`);
	}
}

export const reportsClient = new ReportsApiClient();
export { ReportsApiClient };
