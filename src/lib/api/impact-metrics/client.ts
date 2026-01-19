import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { ImpactMetric } from '../types';

class ImpactMetricsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/impact-metrics`);
	}
}

export const impactMetricsClient = new ImpactMetricsApiClient();
export { ImpactMetricsApiClient };
