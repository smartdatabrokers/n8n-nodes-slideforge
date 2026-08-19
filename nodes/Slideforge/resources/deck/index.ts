import type { INodeProperties } from 'n8n-workflow';
import { deckCreateDescription } from './create';
import { deckOutlineDescription } from './outline';

const showOnlyForDecks = {
	resource: ['deck'],
};

export const deckDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForDecks,
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a deck',
				description: 'Render up to 30 slides in parallel and merge them into one deck',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/render/intent/deck',
					},
				},
			},
			{
				name: 'Outline',
				value: 'outline',
				action: 'Outline a deck',
				description: 'Preview the slide plan and the cost before rendering anything. Free.',
				routing: {
					request: {
						method: 'POST',
						url: '/v1/deck/outline',
					},
				},
			},
		],
		default: 'create',
	},
	...deckCreateDescription,
	...deckOutlineDescription,
];
