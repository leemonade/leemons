const { schema } = require('./schemas/response/getConfigRest');
const { schema: xRequest } = require('./schemas/request/getConfigRest');

const openapi = {
  summary: 'Fetches email plugin configuration',
  description: `This endpoint retrieves the complete configuration for the email plugin, including settings for email sending options, templates, and other related parameters that define how the email system operates within the platform.

**Authentication:** Users must be logged in to access the email configuration settings. Unauthorized access will result in denial of the endpoint.

**Permissions:** Users require administrative permissions specifically related to email configuration management to invoke this endpoint. Lack of sufficient permissions will result in an access denial error.

The flow within this controller begins by invoking the \`getConfig\` method, which is responsible for gathering all configuration data pertaining to the email plugin. This method may interact with a database or configuration store to obtain the required settings. Once the \`getConfig\` method successfully gathers the configuration data, it formats it appropriately and responds with the complete email plugin configuration in a structured JSON format. The endpoints' response will thus contain all the necessary details for front-end components or API consumers to understand and manipulate email settings as permitted.`,
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
