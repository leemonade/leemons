const { schema } = require('./schemas/response/setInstanceFeedbackRest');
const {
  schema: xRequest,
} = require('./schemas/request/setInstanceFeedbackRest');

const openapi = {
  summary: 'Set feedback for a test instance',
  description: `This endpoint allows setting user-specific feedback for a particular test instance. The feedback can include comments, scores, or any formative feedback aimed to be shown to the user after completing the test.

**Authentication:** Users must be authenticated to submit feedback. Lack of proper authentication will prevent access to this functionality.

**Permissions:** The user needs to have 'edit-feedback' permission for the specific test instance to submit or update feedback.

This operation begins by decoding and verifying the user's authentication token to ensure validity and current session activity. Upon successful authentication, the method checks if the authenticated user has the required permission 'edit-feedback' for the test instance in question. If the permission checks succeed, the feedback data provided in the request body is processed and saved into the database linked to the specific test instance. The feedback storage is handled by a dedicated service method within the Moleculer service, which ensures the data integrity and provides error handling in case of database issues. Once successfully stored, the API returns a success message to the client, indicating that the feedback has been set.`,
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
