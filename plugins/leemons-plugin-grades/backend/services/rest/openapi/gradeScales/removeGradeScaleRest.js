const { schema } = require('./schemas/response/removeGradeScaleRest');
const { schema: xRequest } = require('./schemas/request/removeGradeScaleRest');

const openapi = {
  summary: 'Removes a specified grade scale from the system',
  description: `This endpoint is responsible for the deletion of a grade scale entity from the system. The action ensures that the specified grade scale is no longer available and purges it from any related data associations.

**Authentication:** A user must be authenticated to perform grade scale removal operations. Unauthorized attempts to access this endpoint will be blocked.

**Permissions:** To access this endpoint, users must have the 'manage-grade-scales' permission, which allows them to modify or delete grade scales within the system.

Upon receiving a request to remove a grade scale, the handler first verifies if the user is authenticated and has the required permissions. Once validated, it then proceeds to call the \`removeGradeScale\` method from the \`grade-scales\` core. This method internally calls \`canRemoveGradeScale\` to ensure that deleting the grade scale will not cause inconsistencies or violate system constraints. If the grade scale is free of dependencies, such as conditions (\`conditionsInGradeScale\`) or tags (\`gradeTagsInGradeScale\`), and there are no grades currently associated with it (\`gradesInGradeScale\`), the removal process continues. Finally, the \`removeGradeScale\` method deletes the grade scale from the database, and the response is sent back to the user confirming the successful deletion.`,
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
