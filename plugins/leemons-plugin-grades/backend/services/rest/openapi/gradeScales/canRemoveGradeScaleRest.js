const { schema } = require('./schemas/response/canRemoveGradeScaleRest');
const {
  schema: xRequest,
} = require('./schemas/request/canRemoveGradeScaleRest');

const openapi = {
  summary: 'Determine ability to remove a grade scale',
  description: `This endpoint checks whether a specific grade scale can be safely removed from the system without affecting any associated data. It evaluates conditions, tags, and grades linked to the grade scale to ensure no dependencies are violated upon deletion.

**Authentication:** Users need to have an active session in order to invoke this endpoint. Access is restricted to authenticated users only.

**Permissions:** Administrative privileges are required to perform this operation. The user must possess the necessary permission to manage grade scales and perform deletion operations within the platform.

Upon being called, this endpoint primarily executes the \`canRemoveGradeScale\` method from the \`grade-scales\` core module. This method internally calls other functions such as \`conditionsInGradeScale\`, \`gradeTagsInGradeScale\`, and \`gradesInGradeScale\` to thoroughly check for any references to the grade scale in question. Each of these functions queries the database to find records that might be using the grade scale. If no dependencies are found, the grade scale is deemed removable, and the endpoint returns a positive response indicating that the grade scale can be deleted without impacting other elements within the system. If dependencies exist, the response will detail the issues preventing the removal of the grade scale.`,
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
