import type { INodeProperties } from 'n8n-workflow';

export const catalogFieldsDescription: INodeProperties[] = [
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
			show: {
				resource: ['catalog'],
				operation: ['get'],
			},
		},
		description:
			'Layout to describe. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];
