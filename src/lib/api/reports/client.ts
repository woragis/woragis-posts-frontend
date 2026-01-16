import { BaseApiClient } from '../base-client';
import type { Report } from '../types';

class ReportsApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/reports`);
	}
}

export const reportsClient = new ReportsApiClient();
export { ReportsApiClient };
