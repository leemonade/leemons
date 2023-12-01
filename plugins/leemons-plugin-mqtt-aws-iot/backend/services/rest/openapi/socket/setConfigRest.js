const { schema } = require('./schemas/response/setConfigRest');
const { schema: xRequest } = require('./schemas/request/setConfigRest');

const openapi = {
  summary: 'Configure MQTT AWS IoT connection settings',
  description: `This endpoint configures the AWS IoT MQTT connection parameters within the system. It is responsible for setting up the necessary configuration that will allow the system to communicate with AWS IoT services via the MQTT protocol.

**Authentication:** This action requires the user to be authenticated as it involves critical system settings. Unauthenticated access to this endpoint is strictly prohibited to maintain system security.

**Permissions:** Appropriate permissions must be granted to the user to alter IoT connection settings. Without sufficient privileges, the user's request to configure the connection will be rejected to preserve the integrity of the system's configuration.

The controller handler initiates the configuration process by invoking the \`setConfig\` method from the \`socket.core\` module. The \`setConfig\` method accepts the configuration parameters provided in the request and applies them to the system's MQTT connection settings. This involves validating the configuration parameters and updating the connection details that the system uses to establish a communication link with AWS IoT. Once the parameters are validated and set, the system is ready to establish an MQTT connection using the updated configuration. The response to the client will confirm the successful update of the configuration, or it will detail any errors encountered during the process.`,
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
