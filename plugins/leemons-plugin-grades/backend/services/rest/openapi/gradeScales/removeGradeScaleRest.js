const { schema } = require('./schemas/response/removeGradeScaleRest');
const { schema: xRequest } = require('./schemas/request/removeGradeScaleRest');

const openapi = {
  summary: 'Remove a specified grade scale',
  description: `This endpoint allows for the deletion of a specific grade scale from the system, based on the provided grade scale identifier. It ensures that all related dependencies, such as conditions, tags, and actual grades associated with the grade scale, are appropriately handled before deletion to maintain data integrity.

**Authentication:** Users must be authenticated to perform this operation. The system will deny access if the user's credentials are not verified.

**Permissions:** Users need to have adequate permissions typically related to administrative rights on grade scale management to execute the removal of a grade scale.

Upon receiving a request, the \`removeGradeScaleRest\` handler first invokes the \`canRemoveGradeScale\` method to check any related conditions, tags or grades that could be affected by removing the grade scale. If the necessary conditions are met, the \`removeGradeScale\` method from the \`GradeScales\` core module is triggered to delete the grade scale from the database. The process includes validating user permissions and ensuring all related entities that might be impacted are accounted for or notified about the removal. The response confirms the successful deletion or reports an error if the operation cannot be performed.`,
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
