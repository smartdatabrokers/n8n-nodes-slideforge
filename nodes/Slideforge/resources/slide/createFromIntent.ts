import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSlideCreateFromIntent = {
	operation: ['createFromIntent'],
	resource: ['slide'],
};

export const slideCreateFromIntentDescription: INodeProperties[] = [
	{
		displayName: 'Layout Name or ID',
		name: 'form',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getForms',
		},
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSlideCreateFromIntent,
		},
		description:
			'Layout to bind the content to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		routing: {
			send: {
				type: 'body',
				property: 'form',
			},
		},
	},
	{
		displayName: 'Headline',
		name: 'headline',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSlideCreateFromIntent,
		},
		description: 'The slide title, bound verbatim',
		routing: {
			send: {
				type: 'body',
				property: 'headline',
			},
		},
	},
	{
		displayName: 'Blocks',
		name: 'blocks',
		type: 'json',
		default: '',
		displayOptions: {
			show: showOnlyForSlideCreateFromIntent,
		},
		description:
			'Repeating items for list, card, flow and agenda layouts, as an array of {"label","sub","detail","emphasis"} objects',
		routing: {
			send: {
				type: 'body',
				property: 'blocks',
				value: '={{ typeof $value === "string" ? JSON.parse($value) : $value }}',
			},
		},
	},
	{
		displayName: 'Data',
		name: 'data',
		type: 'json',
		default: '',
		displayOptions: {
			show: showOnlyForSlideCreateFromIntent,
		},
		description: 'Chart or table payload for data layouts, matching that layout schema',
		routing: {
			send: {
				type: 'body',
				property: 'data',
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
			show: showOnlyForSlideCreateFromIntent,
		},
		options: [
			{
				displayName: 'Context',
				name: 'context',
				type: 'string',
				default: '',
				description: 'Sub-headline or framing line under the title',
				routing: {
					send: {
						type: 'body',
						property: 'context',
					},
				},
			},
			{
				displayName: 'Dry Run',
				name: 'dryRun',
				type: 'boolean',
				default: false,
				description:
					'Whether to validate and forecast the cost without rendering. Free, returns no file.',
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
				description: 'How covers and section breaks are illustrated',
				routing: {
					send: {
						type: 'body',
						property: 'imagery',
					},
				},
			},
			{
				displayName: 'Minimum Font Size',
				name: 'minFontPt',
				type: 'number',
				default: 12,
				description: 'Type floor in points. Content that cannot fit above it errors instead of shrinking.',
				routing: {
					send: {
						type: 'body',
						property: 'min_font_pt',
					},
				},
			},
			{
				displayName: 'Slide Name',
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
				displayName: 'Source Note',
				name: 'sourceNote',
				type: 'string',
				default: '',
				description: 'Attribution line printed at the foot of the slide',
				routing: {
					send: {
						type: 'body',
						property: 'source_note',
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
				displayName: 'Takeaway',
				name: 'takeaway',
				type: 'string',
				default: '',
				description: 'The conclusion the audience should leave with',
				routing: {
					send: {
						type: 'body',
						property: 'takeaway',
					},
				},
			},
			{
				displayName: 'Theme ID',
				name: 'themeId',
				type: 'string',
				default: '',
				description: 'Theme to render with. Leave empty for the account default.',
				routing: {
					send: {
						type: 'body',
						property: 'theme_id',
					},
				},
			},
			{
				displayName: 'Variant',
				name: 'variant',
				type: 'string',
				default: '',
				description: 'Pin a specific variant of the layout instead of letting SlideForge choose',
				routing: {
					send: {
						type: 'body',
						property: 'variant',
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
				description: 'Right to left also mirrors the composition, for Arabic and Hebrew',
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
