const { schema } = require('./schemas/response/hasRest');
const { schema: xRequest } = require('./schemas/request/hasRest');

const openapi = {
  summary: 'Checks configuration availability for given properties',
  description: `This endpoint verifies the presence and availability of specified configuration properties in the system. It primarily aids in validation checks before application-specific configurations are altered or used.

**Authentication:** User authentication is required to access this endpoint. Only authenticated users can initiate configuration checks to ensure secure access to configuration data.

**Permissions:** Appropriate permissions are needed to query configuration settings. Users must possess 'config.read' permissions or similar to execute this request, ensuring that only authorized personnel can review or modify configurations.

Upon receiving a request, this handler engages the \`hasConfig\` method located within the configuration management core. This method accepts a list of configuration keys and checks their existence and accessibility in the current system configuration. It processes each key individually, utilizing caching mechanisms if available to enhance performance and reduce direct fetches from the primary storage. The response generated confirms whether each queried configuration key is present, aiding clients in decision-making regarding configuration management or adjustments in the application flow.`,
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
