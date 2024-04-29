const { schema } = require('./schemas/response/detailForPageRest');
const { schema: xRequest } = require('./schemas/request/detailForPageRest');

const openapi = {
  summary: 'Provides detailed user information for a specific page',
  description: `This endpoint is designed to fetch and display detailed information about a user that is pertinent to a specific page view. This involves collating user details that enhance the user experience by tailoring page content to individual user profiles.

**Authentication:** The user must be logged in to access detailed information about themselves or others, depending on the permissions granted. Authentication ensures that requests are made by known users.

**Permissions:** User must have the 'view_details' permission for accessing detailed information. This permission check ensures that only authorized users can access sensitive data.

From the initial API call, the method \`detailForPage\` is triggered within the user's service context. This method performs various checks, starting with authentication verification followed by permission checks. Upon successful validation, it retrieves user-specific data tailored to enhance the content of the page where the user info is displayed. The data retrieval involves querying the database for user attributes and settings that are relevant to the page context. The response from this method is then formatted into JSON and sent back to the client, providing a rich, context-specific view of the user's data.`,
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
