const { schema } = require('./schemas/response/getRoomRest');
const { schema: xRequest } = require('./schemas/request/getRoomRest');

const openapi = {
  summary: 'Provides room details associated with user agents',
  description: `This endpoint allows retrieval of room details that are associated with specific user agents. It is designed to fetch room information based on identifiers provided in the request, which can include room ID or other relevant keys linked to rooms within the system.

**Authentication:** Access to this endpoint requires the user to be authenticated. Users who have not logged in or provide invalid authentication tokens will be unable to retrieve room information.

**Permissions:** The user must possess the necessary permissions to view the details of the specified room. Without the appropriate permissions, the request will be rejected to maintain the confidentiality and integrity of the room data.

Once the request is authenticated and permissions are verified, the controller executes a process flow involving several backend functions. The \`getRoomRest\` handler first calls the \`existUserAgent\` method to confirm the existence of the user agent associated with the requester. If the agent exists, it then invokes the \`get.js\` from the \`room\` core module to fetch the detailed information of the room. This involves querying the database with the parameters supplied in the request, and if the room exists and the agent has the correct access rights, the handler returns the room details as a JSON object to the requester. If any part of this process fails (such as if the room does not exist or if the user fails authentication or lacks permissions), the system will return appropriate error messages detailing the nature of the failure.`,
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
