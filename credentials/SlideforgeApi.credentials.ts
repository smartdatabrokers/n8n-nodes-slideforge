import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class SlideforgeApi implements ICredentialType {
	name = 'slideforgeApi';

	displayName = 'SlideForge API';

	icon: Icon = {
		light: 'file:../nodes/Slideforge/slideforge.svg',
		dark: 'file:../nodes/Slideforge/slideforge.dark.svg',
	};

	documentationUrl =
		'https://github.com/smartdatabrokers/n8n-nodes-slideforge?tab=readme-ov-file#credentials';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			required: true,
			default: '',
			placeholder: 'sf_live_...',
			description:
				'Create one at <a href="https://slideforge.dev/console/keys">slideforge.dev/console/keys</a>. New accounts get 60 free slides.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
				'X-SlideForge-Client': 'n8n-nodes-slideforge',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.slideforge.dev',
			url: '/v1/jobs',
			qs: { limit: 1 },
		},
	};
}
