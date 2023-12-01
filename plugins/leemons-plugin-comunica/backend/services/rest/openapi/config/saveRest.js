const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save configuration settings',
  description: `This endpoint allows for the storage of configuration settings. The client can submit new configuration parameters that are then saved and will affect the system's behavior accordingly.

**Authentication:** Users must be authenticated to alter configuration settings. Any access attempt without proper authentication will be rejected.

**Permissions:** Users require administrative permissions to modify system configurations. Without adequate permissions, the request will be denied.

Upon invocation, the endpoint triggers the \`saveConfig\` method defined in the 'Config' service. This method takes the new configuration data from the incoming request and performs a validation check. Once validated, it proceeds to merge the new settings with the existing ones, ensuring that valid configurations are preserved and updated accordingly. It interacts with the storage layer to persist the changes, commonly resulting in an update to a configuration file or a database entry. After successful storage, the service returns an acknowledgment to the REST API endpoint, indicating success or failure of the operation.`,
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
