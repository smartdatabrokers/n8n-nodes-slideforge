import type { INodeProperties } from 'n8n-workflow';
import { catalogFieldsDescription } from './fields';

const showOnlyForCatalog = {
	resource: ['catalog'],
};

export const catalogDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCatalog,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a layout schema',
				description: 'Get the fields, capacity and examples for one layout',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/catalog/forms/{{$parameter.form}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many layouts',
				description: 'List every layout with what it is for and which fields it binds',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/catalog/forms',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'families',
								},
							},
						],
					},
				},
			},
		],
		default: 'getAll',
	},
	...catalogFieldsDescription,
];
