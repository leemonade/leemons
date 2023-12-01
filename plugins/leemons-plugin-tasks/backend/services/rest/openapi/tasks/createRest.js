const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  summary: 'Creates a new task',
  description: `This endpoint creates a new task based on the provided data attributes and assigns it within the system. The process involves storing task information such as title, description, due date, assignees, and any other relevant metadata that defines a task. It ensures that all necessary attributes are validated and correctly structured to conform to the system's task model.

**Authentication:** Users need to be authenticated to create a task. The request will be denied if user credentials are not provided or are invalid.

**Permissions:** The user must have the 'task.create' permission in their role to successfully create a task. Without this permission, the action will be rejected and an appropriate error message will be returned.

Upon receiving a request to create a task, the 'createRest' action is executed. It begins by validating the incoming request data against the task schema. If the validation is successful, the action proceeds to call the 'create.js' method in the task core, passing the sanitized data. The 'create.js' file handles the business logic for task creation, which includes generating unique identifiers, setting creation timestamps, and linking the task to the user or entity it belongs to. Once the task has been successfully created and stored in the database, a response is returned with the details of the newly created task, indicating a successful operation. If any errors occur during this process, such as validation failures or database errors, a descriptive error message is returned to the client.`,
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
