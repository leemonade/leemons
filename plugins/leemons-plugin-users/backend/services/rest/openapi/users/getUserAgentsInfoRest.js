const { schema } = require('./schemas/response/getUserAgentsInfoRest');
const { schema: xRequest } = require('./schemas/request/getUserAgentsInfoRest');

const openapi = {
  summary: 'Obtain user agent details',
  description: `This endpoint provides detailed information about the user agents associated with a user account, including types of devices and browsers used to access the service.

**Authentication:** Users must be authenticated to retrieve their user agent details. Without proper authentication, the endpoint will not provide any data.

**Permissions:** The user must have the necessary permissions to view user agent information. If a user lacks the appropriate permissions, the system will deny access to this data.

Upon receiving a request, the \`getUserAgentsInfoRest\` handler calls the \`getUserAgentsInfo\` method from the User Agents core module. This method receives the current user's context and queries the user agents database collection. The query fetches all user agent records linked to the user's account, aggregating information such as device types, browser names, and last active timestamps. The handler formats this information into a structured output, which is then returned to the client as a JSON object in the response body.`,
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
