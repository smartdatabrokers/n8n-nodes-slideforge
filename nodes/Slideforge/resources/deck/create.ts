import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeckCreate = {
	operation: ['create'],
	resource: ['deck'],
};

export const deckCreateDescription: INodeProperties[] = [
	{
		displayName: 'Slides',
		name: 'slides',
		type: 'json',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDeckCreate,
		},
		description:
			'Array of slides. Each entry is either {"brief":"..."} or a layout binding such as {"form":"agenda_list","headline":"...","blocks":[...]}.',
		routing: {
			send: {
				type: 'body',
				property: 'slides',
				value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
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
			show: showOnlyForDeckCreate,
		},
		options: [
			{
				displayName: 'Deck Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Human-readable name stored with the job',
				routing: {
					send: {
						type: 'body',
						property: 'name',
					},
				},
			},
			{
				displayName: 'Dry Run',
				name: 'dryRun',
				type: 'boolean',
				default: false,
				description:
					'Whether to validate every slide and forecast the cost without rendering. Free, returns no file.',
				routing: {
					send: {
						type: 'body',
						property: 'dry_run',
					},
				},
			},
			{
				displayName: 'Imagery',
				name: 'imagery',
				type: 'options',
				options: [
					{
						name: 'Off',
						value: 'off',
					},
					{
						name: 'Photo',
						value: 'photo',
					},
					{
						name: 'Wash',
						value: 'wash',
					},
				],
				default: 'photo',
				description: 'How covers and section breaks are illustrated across the deck',
				routing: {
					send: {
						type: 'body',
						property: 'imagery',
					},
				},
			},
			{
				displayName: 'Render Despite Failures',
				name: 'forceRender',
				type: 'boolean',
				default: false,
				description:
					'Whether to return the deck even when some slides failed. Off means a failed slide fails the deck.',
				routing: {
					send: {
						type: 'body',
						property: 'force_render',
					},
				},
			},
			{
				displayName: 'Styling',
				name: 'styling',
				type: 'options',
				options: [
					{
						name: 'Clean',
						value: 'clean',
					},
					{
						name: 'Topical',
						value: 'topical',
					},
				],
				default: 'topical',
				description: 'Whether to derive the palette from the subject or keep the theme as-is',
				routing: {
					send: {
						type: 'body',
						property: 'styling',
					},
				},
			},
			{
				displayName: 'Subject Tag',
				name: 'imageryTag',
				type: 'string',
				default: '',
				placeholder: 'healthcare',
				description: 'Industry the deck is about, used to pick photography and palette',
				routing: {
					send: {
						type: 'body',
						property: 'imagery_tag',
					},
				},
			},
			{
				displayName: 'Theme ID',
				name: 'themeId',
				type: 'string',
				default: '',
				description: 'Theme to render every slide with. Leave empty for the account default.',
				routing: {
					send: {
						type: 'body',
						property: 'theme_id',
					},
				},
			},
			{
				displayName: 'Writing Direction',
				name: 'direction',
				type: 'options',
				options: [
					{
						name: 'Left to Right',
						value: 'ltr',
					},
					{
						name: 'Right to Left',
						value: 'rtl',
					},
				],
				default: 'ltr',
				description: 'Applies to every slide in the deck unless a slide overrides it',
				routing: {
					send: {
						type: 'body',
						property: 'direction',
					},
				},
			},
		],
	},
];
