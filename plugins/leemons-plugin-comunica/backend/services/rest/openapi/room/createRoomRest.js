const { schema } = require('./schemas/response/createRoomRest');
const { schema: xRequest } = require('./schemas/request/createRoomRest');

const openapi = {
  summary: 'Create a new communication room',
  description: `This endpoint is responsible for creating a new communication room within the platform. Each room facilitates a designated space for users to interact through messages or shared content.

**Authentication:** Users must be authenticated to create new rooms. Attempts to access this endpoint without a valid authentication token will be rejected.

**Permissions:** Users need to have the 'create_room' permission assigned to their role to successfully execute this action. Without the appropriate permissions, the endpoint will deny the room creation request.

The process begins in the \`createRoomRest\` handler by calling the \`addRoom\` method from the \`room\` core. This method takes necessary room details from the request payload and proceeds to verify the existence of similar room identifiers to avoid duplicates. On successful verification, it initiates the room creation in the database. Post room creation, the handler optionally adds user agents to the room through the \`addUserAgents\` method, allowing specified users immediate access to the room. The flow concludes with a response that includes the details of the newly created room, encapsulating the room's ID and other relevant data.`,
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
