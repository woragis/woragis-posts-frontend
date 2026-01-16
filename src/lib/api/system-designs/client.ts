import { BaseApiClient } from '../base-client';
import type { SystemDesign } from '../types';

class SystemDesignsApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/system-designs`);
	}
}

export const systemDesignsClient = new SystemDesignsApiClient();
export { SystemDesignsApiClient };
