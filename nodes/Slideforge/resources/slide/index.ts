import type { INodeProperties } from 'n8n-workflow';
import { slideCreateDescription } from './create';
import { slideCreateFromIntentDescription } from './createFromIntent';

const showOnlyForSlides = {
	resource: ['slide'],
};

export const slideDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSlides,
		},
		options: [
			{
				name: 'Create From Brief',
				value: 'create',
				action: 'Create a slide from a brief',
				description: 'Describe the slide in plain text and let SlideForge pick the layout',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/render/auto',
					},
				},
			},
			{
				name: 'Create From Layout',
				value: 'createFromIntent',
				action: 'Create a slide from a layout',
				description: 'Bind your own content to a named layout for a deterministic render',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/render/intent',
					},
				},
			},
		],
		default: 'create',
	},
	...slideCreateDescription,
	...slideCreateFromIntentDescription,
];
