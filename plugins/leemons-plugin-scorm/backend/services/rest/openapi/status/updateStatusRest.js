const { schema } = require('./schemas/response/updateStatusRest');
const { schema: xRequest } = require('./schemas/request/updateStatusRest');

const openapi = {
  summary: 'Update SCORM package status for a user',
  description: `This endpoint updates the SCORM package status for a specific user. This action is typically used to track the progress or completion state of a SCORM package within a learning management system (LMS).

**Authentication:** Users need to be authenticated to update their SCORM package status. The system will deny access if authentication credentials are not provided or are invalid.

**Permissions:** Users must have the appropriate permissions to update status records. Without sufficient permissions, the request will be rejected.

The handler executes the process of updating a user's SCORM package status by calling the \`updateStatus\` method located in the \`status\` module's core. It's responsible for handling the logic that updates the status of a SCORM package in the database. The \`updateStatus\` method takes the user's identifier, the SCORM package identifier, and the new status value as parameters. It performs the necessary checks and updates the relevant database record with the new status. Upon successful update, a confirmation is sent back to the user, otherwise, an error message is delivered explaining the reason for failure.`,
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
