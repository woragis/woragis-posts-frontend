import { BaseApiClient } from '../base-client';
import type { AimlIntegration } from '../types';

class AimlIntegrationsApiClient extends BaseApiClient {
	constructor() {
		super(`http://localhost:3013/aiml-integrations`);
	}
}

export const aimlIntegrationsClient = new AimlIntegrationsApiClient();
export { AimlIntegrationsApiClient };
