const { schema } = require('./schemas/response/getRoomListRest');
const { schema: xRequest } = require('./schemas/request/getRoomListRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "List user-associated rooms",
  "description": "This endpoint lists all rooms that a user is associated with, including the ones they have joined or have been invited to. The rooms represent communication channels within the platform which the user can access.

**Authentication:** The users must be authenticated to see their associated rooms. Without proper authentication, the user will not be able to access the room listing.

**Permissions:** Specific permissions are required to ensure that users only see rooms they are authorized to view. The system will enforce these permissions to prevent unauthorized access to room information.

Under the hood, the handler for 'getRoomListRest' calls upon the appropriate methods in the \`room\` core. It begins by authenticating the user through the user's session and checks the required permissions. Assuming the user is authenticated and permitted, it proceeds to retrieve the list of rooms by invoking the \`getUserAgentRoomsList\` method, which constructs a query tailored to the user's context. This query fetches the pertinent room data from a data source, such as a database, and formats it to be user-friendly. The response is then prepared, which includes a JSON array listing each room's details that the user is part of. This array is then sent back to the requesting client within the HTTP response body."
}
`,
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
