const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicate a specific module',
  description: `This endpoint handles the duplication of a module based on the provided module ID. The duplication process involves creating a complete copy of the existing module, including its configurations and associated data, under a new unique identifier.

**Authentication:** Users need to be authenticated to initiate the duplication process. An access check ensures that only authenticated requests are processed.

**Permissions:** The user must have the 'duplicate_module' permission. This permission check is critical to ensure that only authorized users can duplicate modules.

Upon receiving the request, \`duplicateModule\` from the \`ModuleService\` is called with necessary parameters such as module ID and user context. This function orchestrates the cloning of the module's data, adjusting properties as needed to ensure integrity and uniqueness. Success or failure of the duplication is communicated back to the user through the HTTP response, which provides details of the newly created module or error messages if applicable.`,
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
