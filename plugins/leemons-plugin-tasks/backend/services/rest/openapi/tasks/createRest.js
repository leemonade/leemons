const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  // summary: "Summary",
  description: `{
  "summary": "Create new task in the system",
  "description": "This endpoint is designed for the creation of a new task within the system. It processes user's input to register a new task with specified attributes such as title, description, priority, and due date among others.

**Authentication:** User authentication is required to access this endpoint. Users must provide valid credentials to be able to submit new tasks.

**Permissions:** The user must have task creation permissions. Typically, this would be granted to users who are project managers or team leads with rights to manage tasks within their jurisdiction.

The processing of the \`createRest\` handler involves several steps. Firstly, the handler receives the task data sent by the client, which includes all necessary task attributes. It then verifies the user's authorization and permissions to create a new task. After validation, the \`create\` method from \`tasks.core\` is called, passing the task data and user's details. This method primarily handles the business logic for task registration, which includes data validation, setting default values, and saving the new task to the database. Upon successful database entry, a success response is returned to the user, confirming the task creation along with the details of the newly created task."
}`,
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
