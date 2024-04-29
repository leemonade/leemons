const { schema } = require('./schemas/response/abortMultipartRest');
const { schema: xRequest } = require('./schemas/request/abortMultipartRest');

const openapi = {
  summary: 'Abort multipart upload process',
  description: `This endpoint handles the cancellation of an ongoing multipart file upload session. It is designed to ensure that multipart upload operations can be safely terminated without leaving residual data fragments, thus helping in maintaining data consistency and storage optimization.

**Authentication:** User authentication is required to execute this endpoint. An authenticated user context assures that only owners or authorized users abort the intended upload session.

**Permissions:** This endpoint requires file-management permissions, specifically the right to modify or delete file upload sessions as delegated within the user's permission scope.

Upon receiving a request to abort a multipart upload, the endpoint invokes the \`abortMultipart\` function from the corresponding service in the leebrary plugin. This function processes the session identifier provided in the request to locate and halt the active upload process. It then interacts with underlying storage mechanisms to ensure that all partial uploads are either discarded or flagged for cleanup, thereby freeing up resources and preventing partial data storage. The entire process is managed within the framework's structured error handling to ensure that any issues during the abort operation are captured and dealt with appropriately, and appropriate responses are relayed back to the client to reflect the success or failure of the abort operation.`,
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
