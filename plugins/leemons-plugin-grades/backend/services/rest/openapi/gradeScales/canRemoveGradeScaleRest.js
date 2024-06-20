const { schema } = require('./schemas/response/canRemoveGradeScaleRest');
const {
  schema: xRequest,
} = require('./schemas/request/canRemoveGradeScaleRest');

const openapi = {
  summary: 'Determine if a grade scale can be safely removed',
  description: `This endpoint checks if a specified grade scale can be removed from the system without disrupting any associated data. It evaluates dependencies such as conditions, tags, and grades linked to the grade scale to ensure no active references could lead to data integrity issues if the scale were deleted.

**Authentication:** Users need to be authenticated to perform this check. Access without proper authentication will prevent the endpoint from executing.

**Permissions:** Users must have administrative or specific grade management permissions to verify the removability of a grade scale.

The handler begins by calling the \`canRemoveGradeScale\` method within the \`grade-scales\` core module. This method checks associated records in other tables like conditions, tags, and grades that might be using the grade scale. It consolidates this information to determine whether the scale is currently in use or if it can be freely removed. If no dependencies are found, the method returns a positive response, allowing for the safe deletion of the grade scale. This information is then formatted into a JSON response indicating whether removing the grade scale is feasible or not.`,
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
