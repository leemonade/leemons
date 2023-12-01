const { schema } = require('./schemas/response/searchUserAgentsRest');
const { schema: xRequest } = require('./schemas/request/searchUserAgentsRest');

const openapi = {
  summary: 'Searches and returns a list of user agents',
  description: `This endpoint performs a search query to retrieve a list of user agents matching the provided criteria. The search can be based on various attributes such as name, email, or role, and the results include user agents that meet the search parameters.

**Authentication:** Users must be logged in to perform a search on user agents. An unauthenticated request will be denied access to this endpoint.

**Permissions:** Specific permissions are required for a user to search user agents. The user must have the 'list_user_agents' permission or equivalent rights defined within the system's security policy.

The \`searchUserAgentsRest\` action begins by extracting the search parameters from the request. It then calls the \`searchUserAgents\` method in the user agents core, passing these parameters. The search process involves querying the system's database, applying filters based on the input parameters, and potentially involving additional sorting or pagination features. Once the search is complete, the resulting list of user agents is returned to the requesting user in a structured JSON format, containing essential details for each agent.`,
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
