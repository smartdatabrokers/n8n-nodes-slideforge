import type { INodeProperties } from 'n8n-workflow';
import { jobFieldsDescription } from './fields';
import { attachAsBinary } from '../../binary';

const showOnlyForJobs = {
	resource: ['job'],
};

export const jobDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForJobs,
		},
		options: [
			{
				name: 'Download PowerPoint',
				value: 'downloadPptx',
				action: 'Download the powerpoint file',
				description: 'Attach the rendered .pptx to the item as binary data',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/jobs/{{$parameter.jobId}}/pptx',
						encoding: 'arraybuffer',
						json: false,
						headers: {
							Accept:
								'application/vnd.openxmlformats-officedocument.presentationml.presentation',
						},
					},
					output: {
						postReceive: [attachAsBinary('pptx')],
					},
				},
			},
			{
				name: 'Download Preview',
				value: 'downloadPreview',
				action: 'Download the preview image',
				description: 'Attach the rendered PNG preview to the item as binary data',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/jobs/{{$parameter.jobId}}/preview',
						encoding: 'arraybuffer',
						json: false,
						headers: {
							Accept: 'image/png',
						},
					},
					output: {
						postReceive: [attachAsBinary('png')],
					},
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a job',
				description: 'Get the status, fidelity report and warnings of one render',
				routing: {
					request: {
						method: 'GET',
						url: '=/v1/jobs/{{$parameter.jobId}}',
					},
				},
			},
			{
				name: 'Get Many',
				value: 'getAll',
				action: 'Get many jobs',
				description: 'List your recent renders, newest first',
				routing: {
					request: {
						method: 'GET',
						url: '/v1/jobs',
					},
					output: {
						postReceive: [
							{
								type: 'rootProperty',
								properties: {
									property: 'jobs',
								},
							},
						],
					},
				},
			},
		],
		default: 'get',
	},
	...jobFieldsDescription,
];
