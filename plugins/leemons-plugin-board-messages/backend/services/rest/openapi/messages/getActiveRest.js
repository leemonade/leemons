const { schema } = require('./schemas/response/getActiveRest');
const { schema: xRequest } = require('./schemas/request/getActiveRest');

const openapi = {
  summary: 'Fetch active board messages for the current user',
  description: `This endpoint fetches all active messages from the message board that are available or relevant to the current user. The endpoint is designed to provide users with ongoing communications and announcements that are active within the platform's ecosystem.

**Authentication:** User authentication is required to ensure secure access to the messages relevant to the authenticated users only. Access is denied if authentication credentials are not provided or are invalid.

**Permissions:** Specific permissions related to the viewing of board messages are required. Users need the appropriate rights to access different types of messages depending on their roles or group assignments within the platform.

Upon receiving a request, the \`getActive\` method in the \`messages\` backend core is initiated. This method conducts a filtered query through the messages database to retrieve messages that are marked as 'active' and applicable to the user based on their profile and permissions. It processes these data points through various permissions checks and filters to ascertain that each returned message adheres to the security and relevance standards set by the platform. The final output is a list of message IDs, which is then passed to another method (\`byIds\`) to fetch the full details of each active message. The response from the endpoint will include these detailed messages formatted as JSON.`,
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
