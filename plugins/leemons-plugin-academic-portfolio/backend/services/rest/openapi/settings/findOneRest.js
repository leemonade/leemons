const { schema } = require('./schemas/response/findOneRest');
const { schema: xRequest } = require('./schemas/request/findOneRest');

const openapi = {
  summary: 'Fetch specific academic portfolio settings',
  description: `This endpoint retrieves specific settings related to the academic portfolio of a user based on provided criteria. The settings might include configurations related to the user's academic performance, preferences, or system settings unique to the academic portfolio platform.

**Authentication:** User authentication is necessary to ensure that access is granted to only those who own or are granted permission to manage particular academic portfolio settings.

**Permissions:** Access to this endpoint requires specific permissions related to academic portfolio management. Users must have the appropriate role or permission set that allows interaction with academic portfolio settings.

Upon receiving a request, this handler initiates by calling the \`findOneRest\` action, which is designed to fetch particular academic portfolio settings based on the context and parameters provided. Internally, \`findOneRest\` interacts with the 'settings' module by leveraging the \`findOne.js\` service. This service executes a detailed query to locate and retrieve the specified settings from the database. The flow involves authenticating the user, verifying permissions, constructing the query from the request parameters, executing the query, and then finally formatting and returning the results as a JSON object in the response.`,
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
