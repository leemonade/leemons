const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Retrieve configuration settings for the user',
  description: `This endpoint retrieves the current configuration settings for the authenticated user. It allows users to view their configuration settings without modifying any data.

**Authentication:** User authentication is necessary to access the configuration settings. Users must provide valid session credentials to proceed.

**Permissions:** Users need to have 'view_configuration' permission to fetch their configuration data through this endpoint.

The process begins by calling the \`getConfig\` method within the \`ConfigService\`, utilizing the user's identification details provided in the request's context (\`ctx\`). This method interacts with the underlying configuration management system to retrieve the specific settings associated with the user's account. The response is then formulated based on the retrieved data, encapsulating the configuration settings in the form of a JSON object. The entire flow ensures that only authorized and authenticated users can access their configuration settings.`,
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
