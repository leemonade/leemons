const { schema } = require('./schemas/response/coverRest');
const { schema: xRequest } = require('./schemas/request/coverRest');

const openapi = {
  summary: 'Manage file cover updates and retrievals',
  description: `This endpoint handles the retrieval and updating of cover images for files within the leemons platform. It allows users to upload new cover images for specific files or retrieve existing ones, enhancing the file metadata and visual identification within user interfaces.

**Authentication:** Users need to be authenticated in order to update or retrieve file covers. The system checks for a valid user session or access token before processing the request.

**Permissions:** Users must have the appropriate file management permissions or specific rights granted for the file involved. Without sufficient permissions, the request will be denied.

Upon receiving a request, the endpoint first verifies the authentication status and permissions of the user. If the user is authorized, the \`coverRest\` handler then either fetches the current cover image or processes the upload of a new one, depending on the request method (GET for retrieval, POST for upload). The implementation involves calls to the file system storage backend, with careful error handling and response management to ensure that users receive appropriate feedback on the outcome of their request—either providing the image file stream/source or success confirmation of the upload.`,
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
