import type {
	IExecuteSingleFunctions,
	IN8nHttpFullResponse,
	INodeExecutionData,
} from 'n8n-workflow';

/**
 * Attach the downloaded file to the item as binary data, named after the job.
 *
 * n8n's built-in `binaryData` post-receive action leaves the raw buffer sitting in `json` and
 * produces a file with no name, which makes the item unusable by Gmail, Slack or Drive without a
 * rename step. This does the same job and gives the file a name.
 */
export function attachAsBinary(extension: string) {
	return async function (
		this: IExecuteSingleFunctions,
		_items: INodeExecutionData[],
		response: IN8nHttpFullResponse,
	): Promise<INodeExecutionData[]> {
		const jobId = this.getNodeParameter('jobId') as string;
		const binary = await this.helpers.prepareBinaryData(
			Buffer.from(response.body as Buffer),
			`${jobId}.${extension}`,
		);

		return [{ json: { job_id: jobId, file_name: binary.fileName }, binary: { data: binary } }];
	};
}
