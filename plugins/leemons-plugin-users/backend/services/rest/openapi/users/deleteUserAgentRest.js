const { schema } = require('./schemas/response/deleteUserAgentRest');
const { schema: xRequest } = require('./schemas/request/deleteUserAgentRest');

const openapi = {
  summary: 'Delete a specific user agent',
  description: `This endpoint allows for the deletion of a user agent identified by its unique ID. It is intended for removing user agents that are no longer active or required.

**Authentication:** To access this endpoint, users must be authenticated. An attempt to access this endpoint without a valid authentication session will be denied.

**Permissions:** Users need to have the 'delete_user_agent' permission to delete a user agent. Without this permission, the request will not be authorized.

The 'deleteUserAgentRest' action begins with the verification of the user's authentication status and permission to ensure that the requestor has the appropriate rights to delete a user agent. Once verified, it calls the 'deleteById' method from the 'user-agents' core with the relevant agent ID. This method interacts with the underlying database to delete the specified user agent entry. On successful deletion, the method returns a confirmation message. If the user agent cannot be found or the process encounters an error, the service will respond with an appropriate error message detailing the issue.`,
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
