const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Find specific grade setting information',
  description: `This endpoint locates a single setting entity based on the ID provided in the request. The method specifically targets the grades-related settings within the leemons-plugin-grades, retrieving the details like scale, criteria, or any other configured grade parameters specific to the system's usage.

**Authentication:** User authentication is required to ensure that only authorized users can query grade settings. The request will be denied if the authentication credentials are not valid or absent.

**Permissions:** The user must have appropriate permissions related to grade management or settings view. Without sufficient permissions, the request to access grade settings will be declined, ensuring secure and restricted access to sensitive configuration data.

The flow of the endpoint begins with the \`findOne.js\` core settings functionality, which is tasked with querying the backend database for the specific settings ID received through the request parameters. Using Moleculer's data access capabilities, this core function identifies and retrieves the detailed configuration associated with the provided ID. It interacts directly with the database layer, ensuring efficient retrieval of data. Once the data is fetched, it is sent back to the user through the REST endpoint as a JSON object, filling the response with the specific grade setting details.`,
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
