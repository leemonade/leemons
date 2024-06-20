const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Manage organizational settings and configurations',
  description: `This endpoint provides the functionality to manage settings and configurations related to the organization within the admin plugin of the leemons platform. It can include operations such as retrieving, updating, or validating organization data and its related configurations.

**Authentication:** Access to this endpoint requires the user to be authenticated. Failure to provide a valid authentication token will prevent the user from accessing the organization settings.

**Permissions:** This endpoint requires the user to have administrative privileges or specific permissions related to organization management to ensure secure access and modification rights.

The process starts with a request to the \`organization.rest.js\` service, which acts as a router to different organization-related actions within the backend. Depending on the operation requested (retrieve, update, validate), the appropriate method from the \`organization\` core module is invoked. These methods access and manipulate data stored in persistent storage, handling tasks such as fetching current organization details (\`getOrganization\`), updating them (\`updateOrganization\`), or compiling organization-related tokens (\`compileTokens\`). Each of these methods ensures data integrity and compliance with platform standards before sending back the response, which includes the result of the operation in a JSON formatted structure.`,
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
