const { schema } = require('./schemas/response/adminRemoveUserAgentRest');
const {
  schema: xRequest,
} = require('./schemas/request/adminRemoveUserAgentRest');

const openapi = {
  summary: 'Remove user agents from a room',
  description: `This endpoint allows an administrator to remove one or more user agents from a specific room. The action ensures that the targeted user agents will no longer have access to the room after successful execution.

**Authentication:** The user must be authenticated and recognized as an administrator to perform this action. An invalid or missing authentication token will result in endpoint access denial.

**Permissions:** The user must have administrative permissions to modify the membership of the room. This implies the ability to manage users within the platform's communication module.

Upon receipt of the request, the controller calls the \`adminRemoveUserAgents\` method from the \`Room\` core. This method takes a list of user agent identifiers and the identifier of the room from which they should be removed. It then conducts a series of validations to confirm that the requesting user has the requisite administrative privileges and that both the room and user agents exist. Following validation, the method proceeds to alter the room's state, removing the specified user agents. The controller responds with the outcome of these operations, confirming the successful removal of the user agents or providing an error message if the process fails.`,
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
