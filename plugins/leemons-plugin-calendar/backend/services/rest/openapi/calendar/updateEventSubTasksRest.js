const { schema } = require('./schemas/response/updateEventSubTasksRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateEventSubTasksRest');

const openapi = {
  summary: 'Updates event sub-tasks based on user input',
  description: `This endpoint updates the sub-tasks associated with a particular event, based on the instructions provided by the user. The process involves revising the current state of event sub-tasks and applying changes such as marking them as completed, setting new deadlines, or reassigning them to different users.

**Authentication:** Users need to be authenticated and possess a valid session token to interact with this endpoint. Unauthorized requests will be rejected.

**Permissions:** Users must have the 'edit_event_tasks' permission to update event sub-tasks. Without the appropriate permissions, the request will be denied and result in an error response.

Upon receipt of the request, the \`updateEventSubTasksFromUser\` method within the \`events\` core module is called. It receives the specific event identifier and the desired sub-task modifications from the request body. Internally, this method may interact with multiple internal services such as task management, user assignments, and event scheduling. The method orchestrates the necessary validations and database updates to reflect the changes requested by the user. After successful execution, the method returns a confirmation of the update process, and the response will encapsulate the results of the updated sub-tasks in a structured format.`,
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
