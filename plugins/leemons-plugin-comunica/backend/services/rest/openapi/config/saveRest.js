const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Save configuration settings',
  description: `This endpoint allows for the saving of configuration settings in the system. It is used to update or add new configuration parameters to the system's existing config database.

**Authentication:** Users must be authenticated to modify configuration settings. Access to this endpoint is restricted to authenticated sessions where the user possesses valid credentials.

**Permissions:** The user must have 'admin' role or specific configuration management permissions to update or save configurations. These permissions ensure that only authorized personnel can make changes to critical system settings.

The endpoint initiates by invoking the \`saveConfig\` method from the \`ConfigService\`. This method takes key-value pairs of configuration settings from the request body, checks for the user's permissions, and updates the database entries accordingly. The operation uses transaction controls to ensure data integrity during the save process. If the save operation is successful, a confirmation message is returned in the response to the client, indicating the success of the configuration update. If there is a failure, appropriate error handling sequences are initiated and error messages are returned in the response.`,
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
