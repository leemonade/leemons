const { schema } = require('./schemas/response/getOverlapsRest');
const { schema: xRequest } = require('./schemas/request/getOverlapsRest');

const openapi = {
  summary: 'Check for overlaps with other board message configurations',
  description: `This endpoint checks for any overlaps with other board message configurations based on provided criteria. It is designed to ensure that newly created or updated message settings do not conflict with existing configurations within the system.

**Authentication:** This endpoint requires users to be logged in to proceed with the overlap check. Without proper authentication, the endpoint will not be accessible.

**Permissions:** Users need to have adequate permissions to manage board message configurations. This typically involves roles or privileges associated with message administration.

Upon receiving a request, the 'getOverlapsWithOtherConfigurations' method, within the 'leemons-plugin-board-messages' plugin's message core, is invoked. This method operates by comparing the incoming message configuration criteria against all existing board message configurations stored in the database. It identifies any time range overlaps or criteria conflicts, ensuring the uniqueness and non-interference of board message settings. If overlaps are detected, the response includes the conflicting configuration details. The endpoint's response then conveys this overlap information to the client, allowing for appropriate action or adjustment by the user.`,
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
