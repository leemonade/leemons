const { schema } = require('./schemas/response/publicFileRest');
const { schema: xRequest } = require('./schemas/request/publicFileRest');

const openapi = {
  summary: 'Provides public access to specific files',
  description: `This endpoint allows public access to files specified by a file ID. It is primarily used for cases where files need to be shared with users who do not have authenticated sessions or specific permissions within the platform.

**Authentication:** No user authentication is required to access the files through this endpoint. This allows for broader accessibility, making it suitable for public sharing scenarios.

**Permissions:** There are no specific permissions required to use this endpoint. It is designed to be accessed without any user-based restriction, allowing both authenticated and unauthenticated users to retrieve files as long as they have the correct URL or file identifier.

The handler’s flow begins with extracting the file ID from the incoming request parameters. It then queries the underlying storage system or database using this file ID to locate and retrieve the specified file. If the file is successfully found, it streams the file content back to the client, thereby facilitating the file download or viewing process directly through the client’s browser or download manager. This process bypasses the typical user session verification and permission checks, hence serving the file to any requester with the correct direct link.`,
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
