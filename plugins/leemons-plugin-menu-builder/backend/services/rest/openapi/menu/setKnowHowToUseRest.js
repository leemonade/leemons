const { schema } = require('./schemas/response/setKnowHowToUseRest');
const { schema: xRequest } = require('./schemas/request/setKnowHowToUseRest');

const openapi = {
  summary: "Set user's understanding on using REST APIs",
  description: `This endpoint ensures that a specific user has authenticated and acknowledged an understanding of how to utilize REST APIs effectively within the system. It updates user settings or preferences related to API usage.

**Authentication:** This action requires the user to be logged in. A verification process checks if the incoming request has a valid authentication token associated with an active user session.

**Permissions:** The user must have the 'api_usage_write' permission to update their REST API usage preferences. Without this permission, the request will be denied, ensuring that only authorized users can make such changes.

The handler initiates by verifying the user's authentication status using a security middleware that inspects the provided authentication token. Upon successful authentication, the handler then checks if the user possesses the necessary permissions. If all checks are positive, the method \`setKnowHowToUseRest\` from the 'MenuBuilderService' is called with user-specific parameters. This method updates the user's profile or settings indicating their proficiency or preferences in API usage. The response to this operation confirms the successful update of settings, providing a feedback mechanism to the frontend on the status of the operation.`,
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
