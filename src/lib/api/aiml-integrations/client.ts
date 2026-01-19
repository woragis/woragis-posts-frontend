import { BaseApiClient } from '../base-client';
import { config } from '$lib/config';
import type { AimlIntegration } from '../types';

class AimlIntegrationsApiClient extends BaseApiClient {
	constructor() {
		super(`${config.postsApiUrl}/aiml-integrations`);
	}
}

export const aimlIntegrationsClient = new AimlIntegrationsApiClient();
export { AimlIntegrationsApiClient };
