const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists user profiles available in the system',
  description: `This endpoint fetches a comprehensive list of all user profiles available within the platform. It aims to provide a structured overview useful for administrative purposes or user management interfaces.

**Authentication:** Access to this endpoint requires the user to be logged in to the system. Any unauthorized access attempts will be rejected.

**Permissions:** This endpoint requires the user to have administrative privileges or specific rights that allow the viewing of user profiles across the platform.

Upon receiving a request, the endpoint initially ensures that the user is authenticated and authorized to access the data. This verification involves checking the user's authentication token and confirming that they have the necessary permissions. If authentication or authorization fails, the request is immediately rejected. Once verified, the endpoint calls the \`listProfiles\` method from the \`Profiles\` core. This method interacts with the database to retrieve all the profiles stored within it. Each profile is collected and formatted suitably before being sent back to the requester. The final output is delivered as a JSON array of profiles, each containing relevant details such as user IDs, names, and associated roles or permissions.`,
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
