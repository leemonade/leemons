const { schema } = require('./schemas/response/updateEventSubTasksRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateEventSubTasksRest');

const openapi = {
  summary: 'Updates event sub-tasks assigned to a user',
  description: `This endpoint handles the update of sub-tasks linked to specific events within the calendar for a particular user. It ensures that any changes in task status or details are correctly reflected and synchronized across user views and event management systems.

**Authentication:** Users must be logged in to update event sub-tasks. Authentication is required to ensure that only authorized users can make changes to events they have access to.

**Permissions:** This endpoint requires the user to have 'event_update' rights. Permissions are checked to ensure that the currently logged-in user has the appropriate rights to modify sub-tasks within the event.

After receiving the request, the controller first verifies user authentication and permissions. If authentication or permissions checks fail, it returns an error response. If checks pass, it then proceeds to invoke the \`updateEventSubTasksFromUser\` method. This method takes in parameters related to the user's ID and event details, then interacts with the database to update relevant sub-task entries. Changes may involve altering status, descriptions, deadlines, or other sub-task properties. The method aims to ensure data integrity and consistency across the calendar application, updating entries and providing a success status back to the client.`,
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
