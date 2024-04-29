const { schema } = require('./schemas/response/removeGradeTagRest');
const { schema: xRequest } = require('./schemas/request/removeGradeTagRest');

const openapi = {
  summary: 'Removes a specified grade tag',
  description: `This endpoint allows for the deletion of a grade tag from the system, based on the provided tag identifier. The process ensures the removal is handled safely and records are adjusted accordingly to maintain data integrity.

**Authentication:** Users need to be authenticated to perform this action. Actions performed by unauthenticated users will be rejected and they will be prompted to log in.

**Permissions:** The user must have administrative rights or specific permissions related to grade management in order to delete a grade tag. Unauthorized access will result in a permission denial response.

The \`removeGradeTag\` function is called within this endpoint, which initially validates the presence of the tag ID in the request. It then consults the \`GradeTags\` core to ensure the tag exists and is eligible for deletion. The core logic includes verifications to prevent the deletion if the tag is currently in use in any grade assessments or configurations, thereby preserving the integrity of related records. Once all conditions are met, the tag is removed from the records, and a success response is sent back to the user, confirming the deletion.`,
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
