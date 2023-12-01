const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update platform settings',
  description: `This endpoint allows for the updating of various platform settings that control the behavior and features of the admin plugin within the leemons SaaS ecosystem. The settings can include aspects such as global configurations, feature toggles, and defaults that affect how administrators and users interact with the platform.

**Authentication:** User must be authenticated and possess a valid session token to submit changes to the platform settings. An unauthenticated request will be rejected.

**Permissions:** This endpoint requires the user to have administrative privileges. Users without sufficient permissions will not be able to make any updates to the settings.

The update process begins when the \`update\` action from the settings service is triggered through the corresponding RESTful API call. The client request includes a payload with the settings to be updated. Internally, the handler validates the user credentials and permissions. If the user is authorized, the \`update.js\` controller in the settings core is invoked with the payload as an argument. This controller handles the validation of the settings, ensuring they are within acceptable parameters, and applies the necessary updates to the system's configuration. If the update is successful, the service returns an acknowledgment response indicating success, otherwise, errors encountered during the process are returned.`,
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
