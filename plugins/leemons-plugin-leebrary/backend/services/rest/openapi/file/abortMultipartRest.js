const { schema } = require('./schemas/response/abortMultipartRest');
const { schema: xRequest } = require('./schemas/request/abortMultipartRest');

const openapi = {
  summary: 'Abort an ongoing multipart upload process',
  description: `This endpoint handles the termination of an ongoing multipart upload process for a user's file. It ensures that the partially uploaded chunks of the file are properly cleaned up and that no more chunks can be uploaded using the same upload session.

**Authentication:** This endpoint requires the user to be authenticated. Only the user who initiated the multipart upload can abort the process.

**Permissions:** The user must have the 'file-upload:abort' permission. This permission checks if the user is authorized to abort the multipart upload session they have initiated.

Upon receiving a request to abort a multipart upload, the endpoint first verifies that the user is authenticated and has the necessary permissions. It then proceeds to call the \`abortMultipart\` method in the \`files\` core module. This method is responsible for performing any cleanup operations required to abort the upload session. It may involve deleting temporary files or records that were used to keep track of the uploaded chunks. Once these operations are successful, the upload session is marked as aborted, preventing any further upload attempts with the same session ID. The response to the client indicates that the abort operation has been completed, typically through an HTTP status code and a JSON message.`,
  AIGenerated: 'true',
  'x-request': xRequest,
  responses: {
    200: {
      description: 'Success',
      content: {
        'application/json': {
          schema,
        },
      },
    },
  },
};

module.exports = {
  openapi,
};
