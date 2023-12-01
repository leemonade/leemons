const { schema } = require('./schemas/response/updateUserAgentRest');
const { schema: xRequest } = require('./schemas/request/updateUserAgentRest');

const openapi = {
  summary: 'Updates user agent details',
  description: `This endpoint allows for the modification of certain details associated with a user agent. The changes can include updates to user roles, permissions, and other user-specific information that is stored within the user agent record.

**Authentication:** Users are required to be authenticated before making requests to this endpoint. An attempt to update a user agent without proper authentication will be rejected.

**Permissions:** Users need to have the appropriate permissions to update user agent information. Without the necessary permissions, the request will be denied with an appropriate error message indicating the lack of authorization.

Upon receiving the update request, the handler first verifies the client's authentication and authorization to make sure they have permission to update the user agent details. It then proceeds to validate the input data against the established schema for user agent updates. The handler calls the \`update\` method in the \`user-agents\` core, with the provided parameters, to apply the changes in the system's database. If the update is successful, the method will return a confirmation of the changes made. Any errors during this process - such as validation failures or database issues - will result in an error response detailing the reason for the failure.`,
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
