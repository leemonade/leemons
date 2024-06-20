const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specific learning module',
  description: `This endpoint facilitates the removal of a specified learning module by its unique identifier. The process deletes the module from the learning paths system, ensuring that it is no longer accessible or associated with any learning path.

**Authentication:** This action requires the user to be authenticated. Only authenticated sessions can initiate the removal of a module.

**Permissions:** The user must have administrative rights or specific deletion permissions for learning modules to execute this operation.

The endpoint invokes the \`removeModule\` method in the \`Modules\` service. This action flow starts when the endpoint receives a DELETE request containing the module's unique identifier. It then checks for user authentication and verifies if the user has the necessary permissions to remove a learning module. If all checks are pass, the \`removeModule\` method from the \`modules\` core uses this identifier to locate and delete the module from the database. The operation concludes by sending a success or error message back to the client, depending on the outcome of the deletion process.`,
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
