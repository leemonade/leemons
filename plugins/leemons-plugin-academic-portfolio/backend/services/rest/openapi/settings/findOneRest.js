const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Fetch academic portfolio settings for a single entity',
  description: `This endpoint is responsible for retrieving the settings related to the academic portfolio of a specific entity such as a user or an organization. It returns detailed configuration data that informs the frontend on how to display and manage the academic portfolio features.

**Authentication:** Only logged-in users with valid session tokens are allowed to access this endpoint. The session token must be included in the authentication headers of the request.

**Permissions:** Users must have the 'view_academic_portfolio_settings' permission to retrieve the academic portfolio settings. Attempting to access the settings without proper permissions will result in an authorization error.

Upon receiving a request at this endpoint, the handler initially validates the user's credentials and permissions. If validation is successful, it proceeds to call the \`findOne\` method from the \`settings\` core module. This method queries the academic portfolio settings store, likely a database or configuration file, to fetch the relevant settings tied to the provided entity identifier. After the settings are retrieved, they are formatted appropriately and sent back to the client in a structured JSON response containing the configuration details for the requesting entity's academic portfolio.`,
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
