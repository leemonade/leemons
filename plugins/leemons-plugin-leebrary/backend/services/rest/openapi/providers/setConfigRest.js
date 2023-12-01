const { schema } = require('./schemas/response/setConfigRest');
const { schema: xRequest } = require('./schemas/request/setConfigRest');

const openapi = {
  summary: 'Configure library integration provider settings',
  description: `This endpoint is responsible for configuring the integration settings of a library provider in the leemons-plugin-leebrary. This operation includes setting API keys, authentication details, and any other necessary configuration data required by the provider to operate correctly within the leemons SaaS platform.

**Authentication:** Users need to be logged in and possess a valid session token to invoke this endpoint. Unauthorized or unauthenticated requests will be rejected.

**Permissions:** To access this endpoint, users must have the 'manage_library_settings' permission or an equivalent administrative role that allows them to change integration settings.

Upon receiving a request, the handler first validates the user's authentication and permissions. It then proceeds to call the \`setProviderConfig\` function from the \`settings\` core module, passing the configuration parameters supplied in the request body. The \`setProviderConfig\` function updates the provider's configuration in the persistent storage, such as a database or configuration file. If the operation is successful, the handler responds with a confirmation message and HTTP status indicating success. In case of errors during execution, the handler returns an appropriate error message with corresponding HTTP status code.`,
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
