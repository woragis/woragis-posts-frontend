import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { SystemDesign } from '../types';

class SystemDesignsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/system-designs`);
	}
}

export const systemDesignsClient = new SystemDesignsApiClient();
export { SystemDesignsApiClient };
