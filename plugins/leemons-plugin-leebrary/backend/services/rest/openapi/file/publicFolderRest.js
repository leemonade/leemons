const { schema } = require('./schemas/response/publicFolderRest');
const { schema: xRequest } = require('./schemas/request/publicFolderRest');

const openapi = {
  summary: 'Access files in the public folder',
  description: `This endpoint allows users to retrieve files from the designated public folder within the application. The files returned are accessible without authentication, intended for public distribution and sharing.

**Authentication:** No authentication is required to access the public folder contents. Any user, logged in or not, can retrieve the available files from this endpoint.

**Permissions:** The endpoint does not enforce any permission checks due to the public nature of the folder. All files are deemed accessible by any user who makes the request.

Upon receiving a request, the handler for the \`publicFolderRest\` action initiates a file retrieval process from the filesystem corresponding to the public folder's location. It employs a method that lists all files present in the folder, without filtering by user identity or permissions. This method ensures the files are ready for public access, then formats the data as a JSON response. The JSON output contains the file information including name, size, type, and a URL for direct download or access.`,
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
