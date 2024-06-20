const { schema } = require('./schemas/response/getProgramConfigRest');
const { schema: xRequest } = require('./schemas/request/getProgramConfigRest');

const openapi = {
  summary: 'Fetches configuration details of a specific program',
  description: `This endpoint is responsible for retrieving configuration details related to a specified program within the leemons platform. It is designed to ensure users have access to the necessary configuration settings which can involve various parameters and system settings linked to a particular program.

**Authentication:** User must be authenticated to access the configuration details of the program. This is vital to ensure that only authorized users can access sensitive program settings.

**Permissions:** The endpoint requires that the user have specific roles or permission grants, typically \`admin\` or \`config_manager\`, to retrieve program configuration details.

Once invoked, the endpoint executes the \`getProgramConfig\` action from the \`ConfigService\`. This action calls the underlying \`getConfig\` method defined in the \`config\` core module, passing along necessary identifiers such as program ID retrieved from the request parameters. The process includes validation checks to ensure the requestor has required permissions and is authenticated. Upon successful validation, the method queries the database for specified program's configuration using the program ID, then formats and returns this data in a structured JSON response.`,
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
