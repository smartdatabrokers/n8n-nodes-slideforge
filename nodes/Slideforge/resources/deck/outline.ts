import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeckOutline = {
	operation: ['outline'],
	resource: ['deck'],
};

export const deckOutlineDescription: INodeProperties[] = [
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 3,
		},
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDeckOutline,
		},
		description: 'What the deck should cover. Returns the planned slides and the price.',
		routing: {
			send: {
				type: 'body',
				property: 'prompt',
			},
		},
	},
	{
		displayName: 'Slide Count',
		name: 'slideCount',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 30,
		},
		default: 8,
		displayOptions: {
			show: showOnlyForDeckOutline,
		},
		description: 'How many slides to plan',
		routing: {
			send: {
				type: 'body',
				property: 'slide_count',
			},
		},
	},
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: showOnlyForDeckOutline,
		},
		options: [
			{
				displayName: 'Audience',
				name: 'audience',
				type: 'string',
				default: '',
				placeholder: 'board of directors',
				description: 'Who the deck is for',
				routing: {
					send: {
						type: 'body',
						property: 'audience',
					},
				},
			},
			{
				displayName: 'Focus Area',
				name: 'focusArea',
				type: 'string',
				default: '',
				description: 'What the deck should emphasise',
				routing: {
					send: {
						type: 'body',
						property: 'focus_area',
					},
				},
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				placeholder: 'de',
				description: 'ISO 639-1 code applied to every slide',
				routing: {
					send: {
						type: 'body',
						property: 'language',
					},
				},
			},
		],
	},
];
