const { schema } = require('./schemas/response/getGeneralConfigRest');
const { schema: xRequest } = require('./schemas/request/getGeneralConfigRest');

const openapi = {
  summary: 'Retrieve general configuration settings',
  description: `This endpoint retrieves the general configuration settings for the leemons-platform. It allows the retrieval of system-wide settings that are used to configure various aspects of the platform, ensuring consistent behavior across different plugins and services.

**Authentication:** Users need to be authenticated to request the general configuration settings. Unauthenticated requests will be denied, maintaining the privacy and security of the platform's configurations.

**Permissions:** This endpoint requires administrative level permissions. Only users with the appropriate rights can access the general configuration settings, safeguarding the system from unauthorized configuration changes.

Upon invocation, the \`getGeneralConfigRest\` action calls the \`getConfig\` method defined in the \`config.rest.js\` service. The service logic then processes the request by communicating with the \`Config\` core in \`index.js\`, which subsequently calls the \`getGeneral\` method from \`getGeneral.js\`. This method interacts with the platform's configuration storage, possibly a database or an internal settings cache, to gather and compile the requested configuration data. Once retrieved, the configuration is formatted appropriately as a JSON object and returned as part of the HTTP response, providing the client with the system's general settings.`,
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
