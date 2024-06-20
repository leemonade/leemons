const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Updates family data based on specified changes',
  description: `This endpoint allows for the modification of existing family data within the system. The operation includes the ability to alter family-related details such as family name, address, and other relevant attributes that are part of the family profile.

**Authentication:** Users need to be authenticated to update family data. The system will reject requests from unauthenticated sessions.

**Permissions:** The user must have the 'edit_family' permission to modify family data. Without this permission, the request will be denied, ensuring that only authorized users can make changes to family information.

The process begins by validating user authentication and checking for the necessary permissions. Upon successful validation, the \`updateFamily\` method from the \`families\` core is invoked with the updated data payload. This method handles the logic to update the family information in the database, ensuring data consistency and integrity. After the update operation, a confirmation of the update success is sent back in the response, along with the updated family details.`,
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
