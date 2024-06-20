const { schema } = require('./schemas/response/listRest');
const { schema: xRequest } = require('./schemas/request/listRest');

const openapi = {
  summary: 'Lists all users in the system',
  description: `This endpoint lists all users registered within the system, providing a comprehensive overview of each user's basic information without going into sensitive details.

**Authentication:** Users need to be authenticated to retrieve the list of users. Access to this endpoint is contingent upon possessing a valid authentication token.

**Permissions:** Specific permissions are required to access this endpoint. Typically, higher-level administrative roles have the rights to invoke this service to ensure data privacy and adherence to organizational policies.

The endpoint begins by accessing the \`listUsers\` method defined in the \`UserService\`. This method compiles a query which is then executed against the database to fetch all pertinent user data. The query is structured to respect privacy guidelines and only retrieve non-sensitive user attributes. After the database execution, the users' data is returned in a structured format, allowing the calling service to format the response appropriately before sending it back to the client. The response adheres to a JSON structure, providing a clean and understandable list of user data.`,
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
