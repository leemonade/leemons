const { schema } = require('./schemas/response/agentDetailForPageRest');
const {
  schema: xRequest,
} = require('./schemas/request/agentDetailForPageRest');

const openapi = {
  summary:
    "Provides detailed information about a user agent's profile for a specific page",
  description: `This endpoint is designed to fetch detailed information about a user agent's profile tailored for rendering on a particular page. The information typically includes detailed user agent data which is crucial for frontend displays such as user dashboards or profile pages.

**Authentication:** Users need to be authenticated to request their agent detail for a page. Accessing this endpoint without valid authentication will result in a denial of the request.

**Permissions:** The user must have the permission to view the specific user agent's details. The necessary permissions involve querying user agent-related data that might be sensitive.

Upon receiving a request, the endpoint first validates the provided authentication tokens to ensure that the requestor has the rights to access the information. The method \`agentDetailForPage\` in the \`UserAgents\` service is then called with necessary parameters like user agent ID and context. This function queries the database to retrieve detailed information about the user agent. This includes personal details, assigned roles, permissions, and other relevant data necessary for the user interface. The response from this call is then formatted appropriately and returned as a JSON object representing the user agent's profile suitable for page-specific uses.`,
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
