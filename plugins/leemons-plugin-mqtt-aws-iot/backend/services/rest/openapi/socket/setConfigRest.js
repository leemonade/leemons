const { schema } = require('./schemas/response/setConfigRest');
const { schema: xRequest } = require('./schemas/request/setConfigRest');

const openapi = {
  summary: 'Configure AWS IoT MQTT connection settings',
  description: `This endpoint updates the MQTT connection settings for AWS IoT specific to the user's account. It accepts new configuration parameters and applies them to ensure that the MQTT client connects appropriately using the latest credentials and configurations supplied by the user.

**Authentication:** Users must be authenticated to modify their MQTT connection settings. If the authentication details are incorrect or missing, the request will be rejected.

**Permissions:** The user must have administrator privileges to update the MQTT connection settings. This ensures that only authorized personnel can make changes that could impact the messaging infrastructure.

Upon receiving a request, this endpoint first verifies user authentication and checks for administrative permissions. It then calls the \`setConfig\` method in the \`awsClient\` core module, passing the new configuration settings. This method handles the integration with AWS IoT to update the connection parameters based on the inputs. Successful completion of the operation will result in the updated connection settings being applied and a confirmation message being returned to the user.`,
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
