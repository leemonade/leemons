const { schema } = require('./schemas/response/duplicateRest');
const { schema: xRequest } = require('./schemas/request/duplicateRest');

const openapi = {
  summary: 'Duplicate a specified learning module',
  description: `This endpoint duplicates an existing learning module, creating a copy with a new unique identifier. It ensures that all related content and settings are replicated to the new module.

**Authentication:** Users must be authenticated to initiate the duplication of a learning module. Without proper authentication, the request will be denied.

**Permissions:** The user needs specific permissions related to learning path management. Only users with rights to edit or manage learning paths and modules can perform duplication operations.

Upon receiving a request, the handler first verifies user authentication and checks if the user has the required permissions for duplicating a module. If validation passes, the handler calls \`duplicateModule\` from the core \`modules\` service, providing the necessary module data. The \`duplicateModule\` function handles the cloning of the module's data, including any associated assets and configuration. The result is the newly created module object, which is then returned to the user in the HTTP response.`,
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
