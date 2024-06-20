const { schema } = require('./schemas/response/updateAssignConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/updateAssignConfigRest');

const openapi = {
  summary: 'Update assignment configuration settings',
  description: `This endpoint allows for updating the saved configuration settings related to assignments within the system. It handles the modifications of specific configurations and ensures that changes are applied and persisted appropriately across the platform.

**Authentication:** Users need to be authenticated to perform an update on assignment configuration settings. A valid user session must be present, and an API key or access token may be required to authenticate the request.

**Permissions:** The user must have the 'admin' role or specific update permissions for assignment configurations. Without the requisite permissions, the request will be rejected, and an access denied error will be returned.

The endpoint involves several key operations from the moment a request is received. Initially, it validates the incoming data against pre-defined schemas to ensure that all provided information is correct and complete. If validation passes, the endpoint then proceeds to call upon the 'updateConfig' method within the configurations service, passing necessary parameters such as the new configuration details and context information. This method is responsible for checking existing configurations, applying updates, and saving these changes to a persistent storage system, such as a database. Once the update operation is successfully completed, a confirmation response is sent back to the client indicating that the configuration has been updated.`,
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
