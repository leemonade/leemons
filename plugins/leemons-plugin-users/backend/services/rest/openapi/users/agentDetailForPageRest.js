const { schema } = require('./schemas/response/agentDetailForPageRest');
const {
  schema: xRequest,
} = require('./schemas/request/agentDetailForPageRest');

const openapi = {
  summary: 'Details of a user agent for display on a page',
  description: `This endpoint provides detailed information about a specific user agent designed for rendering on a user interface page. It aggregates necessary details such as personal information, contact data, and related metadata for a user-friendly presentation.

**Authentication:** Users need to be logged in to retrieve detailed information about a user agent. Authentication ensures that users can only access information related to themselves or user agents they are permitted to view.

**Permissions:** Appropriate permissions are required to access this endpoint. The exact permissions depend on the role of the requesting user and the privacy policies governing user agent information within the application.

After the initial REST call, the handler invokes a service action that typically starts with an authentication check, ensuring that the request is made by a valid, logged-in user. Following this, it verifies if the logged-in user has the necessary permissions to access the details of the requested user agent. Once authenticated and authorized, the handler fetches data from several core service methods - such as \`getUserDatasetInfo\`, \`getPreferences\`, and potentially \`userAgentsAreContacts\` to gather comprehensive information about the user agent. This includes both static and dynamic data like the agent's contact details, profile preferences, and any relationships with other user agents. The aggregated data is then formatted suitably for client-side rendering and returned as a JSON object, which will be used to populate a detailed view page on the front-end of the application.`,
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
