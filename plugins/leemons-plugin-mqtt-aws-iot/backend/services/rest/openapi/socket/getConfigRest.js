const { schema } = require('./schemas/response/getConfigRest');
const { schema: xRequest } = require('./schemas/request/getConfigRest');

const openapi = {
  summary: 'Fetch AWS IoT MQTT configuration settings',
  description: `This endpoint retrieves the current configuration settings necessary for establishing a connection to the AWS IoT service via MQTT. These settings are essential for clients that need to communicate securely with IoT devices managed through AWS IoT.

**Authentication:** Users must be authenticated to access the MQTT configuration settings. An invalid or missing authentication token will prevent access to this endpoint.

**Permissions:** This endpoint requires users to have 'admin' permissions to access sensitive IoT configuration details.

The process begins in the \`getConfigRest\` action handler which directly calls the \`getConfig\` method from the \`socket\` core module. This method is responsible for loading and returning the current AWS IoT MQTT configuration, which includes endpoint details, certificates, and keys necessary for secure MQTT communication. The configuration data is then formatted as a JSON object and sent back to the client within the HTTP response body, ensuring that only authorized and properly authenticated users can obtain this sensitive information.`,
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
