const { schema } = require('./schemas/response/getUserAssignableResponsesRest');
const {
  schema: xRequest,
} = require('./schemas/request/getUserAssignableResponsesRest');

const openapi = {
  summary: 'Retrieve assignable feedback responses for a user',
  description: `This endpoint fetches all feedback responses that a user can assign to others based on their role and permissions within the system. It focuses on identifying which feedback mechanisms and associated responses are available for delegation by a specific user.

**Authentication:** User authentication is required to ensure that the request is made by a valid user and to ascertain the user’s role and permissions accurately.

**Permissions:** The user must have permissions that allow assigning feedback to others. This typically includes administrative or supervisory roles that manage user interactions and feedback within the platform.

Upon receiving a request, the \`getUserAssignableResponsesRest\` handler initiates by calling the \`getUserAssignableResponses\` function in the \`feedback-responses\` core module. This function performs a lookup to determine the feedback items that the user can assign based on the user's credentials, roles, and specific system-defined permissions. The function consults various data sources such as user roles, active permissions, and existing feedback assignment rules to compile a list of assignable feedback responses. Finally, a response with the list of assignable feedback items formatted as a JSON object is sent back to the caller.`,
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
