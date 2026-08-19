import {
	NodeConnectionTypes,
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
	type INodeType,
	type INodeTypeDescription,
} from 'n8n-workflow';
import { slideDescription } from './resources/slide';
import { deckDescription } from './resources/deck';
import { jobDescription } from './resources/job';
import { catalogDescription } from './resources/catalog';

export class Slideforge implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'SlideForge',
		name: 'slideforge',
		icon: { light: 'file:slideforge.svg', dark: 'file:slideforge.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Render editable PowerPoint slides and decks with SlideForge',
		defaults: {
			name: 'SlideForge',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'slideforgeApi', required: true }],
		requestDefaults: {
			baseURL: 'https://api.slideforge.dev',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-SlideForge-Client': 'n8n-nodes-slideforge',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Catalog',
						value: 'catalog',
					},
					{
						name: 'Deck',
						value: 'deck',
					},
					{
						name: 'Job',
						value: 'job',
					},
					{
						name: 'Slide',
						value: 'slide',
					},
				],
				default: 'slide',
			},
			...slideDescription,
			...deckDescription,
			...jobDescription,
			...catalogDescription,
		],
	};

	methods = {
		loadOptions: {
			async getForms(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const response = (await this.helpers.httpRequestWithAuthentication.call(
					this,
					'slideforgeApi',
					{
						method: 'GET',
						url: 'https://api.slideforge.dev/v1/catalog/forms',
						json: true,
					},
				)) as { families?: Array<{ form: string; menu?: string }> };

				return (response.families ?? []).map((family) => ({
					name: family.form,
					value: family.form,
					description: family.menu,
				}));
			},
		},
	};
}
