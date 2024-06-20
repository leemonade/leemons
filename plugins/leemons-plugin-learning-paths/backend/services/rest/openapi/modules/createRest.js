const { schema } = require('./schemas/response/createRest');
const { schema: xRequest } = require('./schemas/request/createRest');

const openapi = {
  summary: 'Create a new learning module',
  description: `This endpoint facilitates the creation of a new learning module within the leemons platform. The implementation includes constructing module details such as title, description, and associated learning assets based on input data.

**Authentication:** A user must be authenticated to perform this action. Authentication ensures that requests to this endpoint are made by valid users of the platform.

**Permissions:** The user needs to have the 'create_module' permission to be able to execute this action. This ensures only authorized users can add new learning modules.

Once the endpoint receives a request, it calls the \`createModule\` function from the \`modules\` core service. This function takes user-provided data such as module names, descriptions, and learning objective identifiers to assemble a new module instance. The process involves validating input data, ensuring correctness and completeness before creating the module in the database. Upon successful creation, the service returns details of the newly created module along with a status code indicating successful creation.`,
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
