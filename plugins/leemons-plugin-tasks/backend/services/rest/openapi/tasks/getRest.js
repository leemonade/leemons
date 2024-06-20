const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Retrieves task details based on the provided task identifier',
  description: `This endpoint retrieves the specific details of a task identified by its unique identifier. It aims to provide comprehensive information about an individual task, including its status, assigned users, deadlines, and other relevant metadata which are crucial for managing tasks within a project.

**Authentication:** User must be logged in to access this endpoint. Authentication ensures that the user's session is valid for security purposes.

**Permissions:** Appropriate permissions are required to access this task's details. These permissions ensure that users are only able to retrieve tasks to which they have been granted explicit access rights.

Upon receiving a request, this endpoint invokes the \`getTask\` method from the \`tasks\` service, which is responsible for querying the database with the task's unique identifier. The method processes the request by validating the user’s identity and permissions before retrieving the task data. The process involves multiple checks for authentication and authorization to ensure secure and compliant access to the task information. Once validated, the task data is fetched and formatted before being sent back to the user as a JSON object that contains the detailed information about the task.`,
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
