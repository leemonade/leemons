const { schema } = require('./schemas/response/deleteConfigRest');
const { schema: xRequest } = require('./schemas/request/deleteConfigRest');

const openapi = {
  summary: 'Delete a specific configuration setting',
  description: `This endpoint handles the deletion of a specific configuration setting in the system. Given an ID, it will permanently remove the associated configuration from the database.

**Authentication:** User must be logged in to execute this action. Authentication ensures that only valid and authorized users can delete configuration settings.

**Permissions:** Specific 'admin' permissions are required to delete configuration settings. Users without the requisite permissions will be denied access to this endpoint.

Upon receiving a DELETE request, the \`deleteConfigRest\` method first verifies the user's authentication and permissions. After validation, it proceeds to call the internal \`deleteConfigById\` service method, passing the unique configuration ID from the request. This service method interacts with the database to delete the specified configuration setting. If the operation is successful, the endpoint returns a confirmation message stating that the setting has been deleted. In case of errors during processing, appropriate error messages are generated and returned to the user.`,
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
