const { schema } = require('./schemas/response/deleteCurriculumRest');
const { schema: xRequest } = require('./schemas/request/deleteCurriculumRest');

const openapi = {
  summary: 'Delete a specified curriculum',
  description: `This endpoint is responsible for the deletion of a curriculum entity within the platform. It handles the removal of the curriculum data and all related information from the system.

**Authentication:** Users need to be authenticated to utilize this endpoint. Proper credentials are required, and failure to provide them will deny the operation.

**Permissions:** This action requires specific permissions that allow a user to delete curriculum data. Without the necessary permissions, the request will be rejected.

The deletion process begins with the \`deleteCurriculumRest\` action in the \`curriculum.rest.js\` service file. This action then calls the \`deleteCurriculum\` method from the \`curriculum\` core module, which performs the actual deletion logic. The method operates by identifying the curriculum with the given identifier and proceeding with the necessary database operations to remove the curriculum record and any associated data. A successful operation results in a confirmation response, while a failure returns an appropriate error message detailing the issue encountered during the deletion process.`,
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
