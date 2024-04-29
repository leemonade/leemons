const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update system settings',
  description: `This endpoint updates the system settings for the administration area. The modifications can include changes to system configurations, updates to operational settings, or adjustments to user permissions based on the provided inputs.

**Authentication:** Users need to be authenticated to perform updates to the system settings. A valid session or token is required to authenticate the user identity and authorize access to this endpoint.

**Permissions:** Users must have 'admin' level permissions to update system settings. This ensures that only authorized personnel can make significant changes to the system configuration.

The endpoint initiates by calling the \`updateSettings\` method, utilizing the request's payload which contains new setting values provided by the user. This method processes the input data, validates the changes against the current system configurations, and applies the updates if they are consistent with the system's operational guidelines. On successful update, the method sends a confirmation back to the user along with a summary of the updated settings. In case of errors during the update process, suitable error messages are generated and sent back to the user to allow them to address any inconsistencies or validation failures.`,
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
