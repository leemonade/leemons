const { schema } = require('./schemas/response/disableUserAgentRest');
const { schema: xRequest } = require('./schemas/request/disableUserAgentRest');

const openapi = {
  summary: 'Disable a specific user agent',
  description: `This endpoint allows for the disabling of a specified user agent associated with a user's account. Disabling a user agent typically refers to revoking access or deactivating a particular session or device from being able to use the platform.

**Authentication:** Users must be authenticated and possess a valid session to perform this action. Authentication ensures that the request to disable a user agent is made by the rightful account holder or an authorized individual.

**Permissions:** The user needs to have the appropriate permissions to manage user agents. This may involve permissions to alter session states or access control permissions within the user's account scope.

When a request is received, the controller resolves the authenticated user's identity and verifies if the user has the necessary permissions to disable a user agent. It then calls the \`disableUserAgent\` method from the user agents core module. This method interacts with the underlying data store to update the status of the user agent to 'disabled'. The flow ensures that the request adheres to business rules and security measures before confirming the change of state. Once the user agent is successfully disabled, a confirmation is sent back to the user, informing them of the successful operation.`,
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
