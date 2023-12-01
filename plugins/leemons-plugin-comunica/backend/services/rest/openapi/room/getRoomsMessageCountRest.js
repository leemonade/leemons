const { schema } = require('./schemas/response/getRoomsMessageCountRest');
const {
  schema: xRequest,
} = require('./schemas/request/getRoomsMessageCountRest');

const openapi = {
  summary: 'Counts messages in user-accessible rooms',
  description: `This endpoint calculates the number of messages for each room that the user is a part of. It aggregates the total count of messages to help users understand the volume of communication in their accessible rooms.

**Authentication:** Users must be authenticated to fetch message counts for the rooms they are members of. Authentication ensures that message counts are only provided for the rooms relevant to the authenticated user.

**Permissions:** Users need to have the 'view_room_messages' permission to retrieve message counts. The system checks the user's permissions against each room to ensure they are only getting information they are authorized to view.

Upon receiving a request, the handler first verifies the user's authentication and permissions. Once authorized, it calls the \`getRoomsMessageCount\` method from the room core module. This method uses a query to the database to calculate the number of messages per room based on the user's access rights. The resulting message counts are then organized in a response object and sent back to the user in a structured JSON format, with each room's ID mapped to its message count.`,
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
