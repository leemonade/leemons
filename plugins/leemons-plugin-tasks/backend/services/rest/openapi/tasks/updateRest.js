const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update an existing task',
  description: `This endpoint allows for the modification of an existing task in the system. The task is identified by a unique identifier and the changes can include updates to properties such as its title, description, deadline, assignees, and any other task-related information.

**Authentication:** All requests to this endpoint require that the user is authenticated. Failure to provide valid credentials will result in an unauthorized response.

**Permissions:** Users need to have the 'edit_task' permission in order to update a task. If a user attempts to update a task without the proper permissions, an access denied error will be returned.

Upon receiving the request, the \`updateRest\` action handler orchestrates the task update process. It validates the request's parameters to ensure they are well-formed and then calls the \`update\` method from the \`task\` core. The \`update\` method is responsible for all business logic associated with updating a task, including input validation, persistence of the changes to the database, and the handling of any necessary notifications or further business rule processing. Once the update is successful, the method responds with the updated task details, while in the case of failure, an appropriate error message is returned to the client.`,
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
