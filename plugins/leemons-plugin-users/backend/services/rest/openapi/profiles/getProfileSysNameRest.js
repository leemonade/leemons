const { schema } = require('./schemas/response/getProfileSysNameRest');
const { schema: xRequest } = require('./schemas/request/getProfileSysNameRest');

const openapi = {
  summary: 'Fetch system name for a given user profile',
  description: `This endpoint allows retrieval of the system name associated with a specific user profile based on the provided profile identifier. The system name is a unique identifier used internally within the system to reference user profiles.

**Authentication:** Users need to be authenticated to request the profile system name. Any requests made without proper authentication will be rejected.

**Permissions:** This endpoint requires the user to have permissions to view user profile details. If the user does not have the appropriate permissions, the request will be denied with an appropriate error message.

Upon receiving a request, the endpoint executes the \`getProfileSysName\` method from the \`profiles\` core module. This method is responsible for performing a query to locate the system name using the profile ID included in the request parameters. The process involves validating the user's session for authentication, checking their permissions to ensure they are authorized to fetch system names, and then interacting with the underlying data store to retrieve the relevant information. The resolved result is then sent back to the client as a JSON object containing the profile's system name.`,
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
