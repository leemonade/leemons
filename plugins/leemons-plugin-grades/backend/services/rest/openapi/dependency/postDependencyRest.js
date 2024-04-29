const { schema } = require('./schemas/response/postDependencyRest');
const { schema: xRequest } = require('./schemas/request/postDependencyRest');

const openapi = {
  summary: 'Manage grade dependencies within a course structure',
  description: `This endpoint is responsible for setting and managing the dependencies between different grades within the course structure. It ensures that certain prerequisites are set and met before a student can progress to subsequent modules or components.

**Authentication:** User authentication is mandatory to ensure that only authorized personnel can modify grade dependencies. Access without proper authentication will prevent usage of this endpoint.

**Permissions:** This endpoint requires the user to have administrative privileges related to grade management. Users must hold the appropriate permissions to alter grade dependencies within the course structure.

Upon receiving a request, the \`postDependencyRest\` handler in the \`dependency.rest.js\` file first verifies user authentication and permissions, ensuring the user is authorized to perform actions related to grade dependencies. It then proceeds to parse the incoming request to extract and validate the necessary data regarding grade dependencies. This involves calling various methods and possibly interacting with other services to verify conditions and prerequisites are met. Finally, the validated data is processed to update or establish new dependencies in the data system, culminating in the response back to the user indicating the success or failure of the operations performed.`,
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
