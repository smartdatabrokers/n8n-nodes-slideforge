import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSlideCreate = {
	operation: ['create'],
	resource: ['slide'],
};

export const slideCreateDescription: INodeProperties[] = [
	{
		displayName: 'Brief',
		name: 'brief',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForSlideCreate,
		},
		description:
			'What the slide should say. SlideForge routes it to a layout and binds your text verbatim.',
		routing: {
			send: {
				type: 'body',
				property: 'brief',
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
			show: showOnlyForSlideCreate,
		},
		options: [
			{
				displayName: 'Allow Made-Up Numbers',
				name: 'allowFabrication',
				type: 'boolean',
				default: false,
				description:
					'Whether a data layout may invent figures the brief does not contain. Off by default, so a thin brief is refused instead of filled in.',
				routing: {
					send: {
						type: 'body',
						property: 'allow_fabrication',
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
				displayName: 'Expand Brief',
				name: 'expandBrief',
				type: 'boolean',
				default: false,
				description: 'Whether a thin brief may be padded with plausible supporting copy',
				routing: {
					send: {
						type: 'body',
						property: 'expand_brief',
					},
				},
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				placeholder: 'de',
				description: 'ISO 639-1 code to render the slide in, such as de, ja or ar',
				routing: {
					send: {
						type: 'body',
						property: 'language',
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
		],
	},
];
