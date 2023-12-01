const { schema } = require('./schemas/response/publicFileRest');
const { schema: xRequest } = require('./schemas/request/publicFileRest');

const openapi = {
  summary: 'Provides public access to a specified file',
  description: `This endpoint allows for the retrieval of files that have been marked as public within the system. It enables users to access a specific file by using a public URL, typically without requiring user authentication or specific permissions.

**Authentication:** Public files can be accessed without the user being logged in. This endpoint is designed to be accessible without an authentication token.

**Permissions:** This endpoint does not require any specific user permissions as the files are intended to be publically accessible. The security model ensures that only files marked for public access are retrievable through this endpoint.

Upon receiving a request, the handler validates the provided file identifier and ensures the requested file is available for public access. It calls the corresponding method, likely within a 'FilesService', which handles the logic for fetching and verifying the file's public availability. The service queries the database to verify the file's status and retrieve its data if it is marked as public. The file data is then returned to the user in the appropriate format (e.g., binary data, JSON object) for direct download or use within client applications.`,
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
