import { BaseApiClient } from '../base-client';
import type { ImpactMetric } from '../types';

class ImpactMetricsApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/impact-metrics`);
	}
}

export const impactMetricsClient = new ImpactMetricsApiClient();
export { ImpactMetricsApiClient };
