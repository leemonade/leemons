const { schema } = require('./schemas/response/saveRest');
const { schema: xRequest } = require('./schemas/request/saveRest');

const openapi = {
  summary: 'Saves updated configuration settings for the academic calendar',
  description: `This endpoint handles the saving of modified configuration settings specific to the academic calendar within the application. It involves updating configuration details such as term dates, academic events, and other relevant settings that govern the academic calendar functionality.

**Authentication:** Users must be authenticated before they can update configuration settings. An absence of a valid authentication session will prevent access to this functionality.

**Permissions:** This endpoint requires administrative rights or specific permissions related to academic calendar management. Without these permissions, the user will be denied the ability to save changes to the configuration.

After receiving the configuration data from the client, this handler first validates the incoming data against predefined schemas to ensure compliance with expected formats and types. Upon successful validation, the \`saveConfig\` function from the \`config\` core module is called with the new configuration data. This function updates the settings in the persistent storage, such as a database or a configuration file. Once the update is successfully completed, a confirmation response is sent back to the client indicating successful saving of the configuration.`,
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
