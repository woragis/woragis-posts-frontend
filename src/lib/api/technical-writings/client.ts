import { BaseApiClient } from '../base-client';
import type { TechnicalWriting } from '../types';

class TechnicalWritingsApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/technical-writings`);
	}
}

export const technicalWritingsClient = new TechnicalWritingsApiClient();
export { TechnicalWritingsApiClient };
