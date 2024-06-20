const { schema } = require('./schemas/response/getPlatformNameRest');
const { schema: xRequest } = require('./schemas/request/getPlatformNameRest');

const openapi = {
  summary: 'Fetch platform name configuration',
  description: `This endpoint retrieves the platform name from the system configuration. This information is utilized to provide context or personalize user interactions with the system.

**Authentication:** Users are not required to be authenticated to access this endpoint. It serves general information applicable to any user accessing the platform.

**Permissions:** There are no specific permissions required to access this endpoint, since it provides non-sensitive, general information about the platform.

Upon receiving a request, the handler triggers the \`getPlatformName\` function defined in the \`platform\` core module. This function is responsible for accessing the system’s configuration and extracting the name of the platform. The operation is straightforward, generally involving a read operation from a configuration file or a database query, depending on how the platform is set up. The result of this operation is then formatted properly and sent back to the requester in the response body as plain text or JSON, depending on the implementation specifics. The process ensures that any user or system interacting with the endpoint receives accurate and up-to-date information regarding the platform's name.`,
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
