const { schema } = require('./schemas/response/getRoomRest');
const { schema: xRequest } = require('./schemas/request/getRoomRest');

const openapi = {
  summary: 'Retrieve room details by ID',
  description: `This endpoint fetches detailed information about a specific room within the Leemonade platform. It identifies the room based on the unique ID provided in the request and returns comprehensive data about the room configuration and its attributes.

**Authentication:** The user must be authenticated to access the detailed information of a room. Unauthenticated requests would be automatically rejected with an appropriate error response.

**Permissions:** Users need to have 'room.view' permission to access this endpoint. Without sufficient permissions, the access to the room details will be denied, ensuring that only authorized users can retrieve sensitive room data.

This handler, \`getRoomRest\`, starts by validating the provided room ID using the \`exists.js\` validation script to ensure the room ID is present in the system. Upon successful validation, the \`get.js\` from the \`room\` core module is invoked, which handles the database queries to fetch and return the room details. The process flows systematically, from validating user authentication and permissions to executing the core retrieval logic, ensuring a secure and efficient data delivery. The final response encapsulates the room details in a JSON format, providing a precise and structured data view to the client.`,
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
