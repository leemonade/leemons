const { schema } = require('./schemas/response/getUserAssignableResponsesRest');
const {
  schema: xRequest,
} = require('./schemas/request/getUserAssignableResponsesRest');

const openapi = {
  summary: 'Get user-assignable feedback responses',
  description: `This endpoint fetches all feedback responses that a user is eligible to assign. It is designed to provide a tailored list of responses based on the user's role and permissions within the feedback system.

**Authentication:** The endpoint requires the user to be logged in. Without authentication, the user cannot obtain the list of assignable responses.

**Permissions:** The user must have the 'feedback.assign' permission to access these responses. If the user lacks this permission, the endpoint will deny access.

The controller begins by triggering the 'getUserAssignableResponsesRest' action, which internally calls the 'getUserAssignableResponses' function from the 'feedback-responses' core module. The function takes the authenticated user's details as input and queries the feedback system database to retrieve the responses that user can assign. Consistent with the principle of least privilege, the query filters responses based on the user's role, ensuring they only receive responses appropriate to their level of authority. Upon successful retrieval, the user is provided with a JSON object containing the list of assignable feedback responses.`,
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
