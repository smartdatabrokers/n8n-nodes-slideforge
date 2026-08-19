import type { INodeProperties } from 'n8n-workflow';

const showOnlyForJobGetMany = {
	operation: ['getAll'],
	resource: ['job'],
};

export const jobFieldsDescription: INodeProperties[] = [
	{
		displayName: 'Job ID',
		name: 'jobId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: {
				resource: ['job'],
				operation: ['get', 'downloadPptx', 'downloadPreview'],
			},
		},
		description: 'The job_id returned by a slide or deck render',
		placeholder: '={{ $json.job_id }}',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForJobGetMany,
		},
		description: 'Whether to return all results or only up to a given limit',
		routing: {
			send: {
				paginate: '={{ $value }}',
			},
			operations: {
				pagination: {
					type: 'offset',
					properties: {
						limitParameter: 'limit',
						offsetParameter: 'offset',
						pageSize: 100,
						type: 'query',
					},
				},
			},
		},
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		displayOptions: {
			show: {
				...showOnlyForJobGetMany,
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
		routing: {
			send: {
				type: 'query',
				property: 'limit',
			},
			output: {
				maxResults: '={{$value}}',
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: showOnlyForJobGetMany,
		},
		options: [
			{
				displayName: 'Include Deck Slides',
				name: 'includeChildren',
				type: 'boolean',
				default: false,
				description:
					'Whether to include the individual slides of a deck as well as the deck itself',
				routing: {
					send: {
						type: 'query',
						property: 'include_children',
					},
				},
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Complete',
						value: 'complete',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
					{
						name: 'Queued',
						value: 'queued',
					},
					{
						name: 'Rendering',
						value: 'rendering',
					},
				],
				default: 'complete',
				description: 'Only return jobs in this state',
				routing: {
					send: {
						type: 'query',
						property: 'status',
					},
				},
			},
		],
	},
];
