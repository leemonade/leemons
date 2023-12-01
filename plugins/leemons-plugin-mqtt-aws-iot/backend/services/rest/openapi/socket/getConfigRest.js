const { schema } = require('./schemas/response/getConfigRest');
const { schema: xRequest } = require('./schemas/request/getConfigRest');

const openapi = {
  summary: 'Fetch MQTT AWS IoT configuration settings',
  description: `This endpoint retrieves the configuration settings specific to the MQTT AWS IoT service. These settings are necessary to establish a connection to AWS IoT and communicate with other IoT devices in the network.

**Authentication:** Only authenticated users with valid session tokens can request the MQTT AWS IoT configuration settings. If not authenticated, the request will be rejected.

**Permissions:** Users need to have the 'mqtt-config-view' permission to access this endpoint. Without this permission, the request will be denied, ensuring that only authorized users can retrieve configuration details.

Upon invocation, the handler calls the \`getConfig\` method from the \`socket\` core module. This method reads the necessary configuration from the environment or configuration files that are essential for connecting with the MQTT broker provided by AWS IoT. It then formats these details into a compliant structure expected by the client and returns them. The whole process involves secure retrieval and handling of sensitive information such as access keys and certificates, which are imperative for the secure operation of IoT communications.`,
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
