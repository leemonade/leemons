const { schema } = require('./schemas/response/deleteSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/deleteSubjectTypeRest');

const openapi = {
  summary: 'Remove a specific subject type from the academic portfolio',
  description: `This endpoint removes a subject type from the academic portfolio system based on a provided identifier. The action ensures that all dependencies or related data are handled according to defined business rules prior to deletion, preventing any orphan records or inconsistent data states.

**Authentication:** Users must be authenticated to perform this operation. Access to this endpoint will be denied if proper authentication credentials are not provided.

**Permissions:** This endpoint requires administrative privileges or specific permissions related to academic structure management. Users without sufficient permissions will receive an error response indicating insufficient permissions.

The delete process initiates by verifying user permissions and authentication. Once authorized, the \`removeSubjectType\` method from the core \`subject-type\` module is called with the subject type's unique identifier. This method checks for any dependencies or related entities that might be impacted by the deletion of the subject type. Upon successful validation of all conditions, the subject type is removed from the database, and a confirmation message is returned to the user. If any issues arise during the process, appropriate error messages are generated and sent back in the response.`,
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
