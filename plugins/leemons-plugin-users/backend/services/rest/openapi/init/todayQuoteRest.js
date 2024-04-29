const { schema } = require('./schemas/response/todayQuoteRest');
const { schema: xRequest } = require('./schemas/request/todayQuoteRest');

const openapi = {
  summary: 'Provides the quote of the day for the user',
  description: `This endpoint serves the purpose of offering a motivational or inspirational 'Quote of the Day' to the user. These quotes may vary daily and can be specific to user's interests if set in the user's profile preferences.

**Authentication:** User authentication is required to access this feature. Unauthorized access attempts will be blocked and logged for security reasons.

**Permissions:** Users must have the 'read_quotes' permission enabled in their account settings to view the daily quote. Without this permission, access to the daily quote will not be granted.

Upon receiving a request at this endpoint, the backend service first verifies the user's credentials and checks for the necessary permissions ('read_quotes'). If the authentication and permissions validation are successful, the service then proceeds to fetch the 'Quote of the Day' from a dedicated quotes management module integrated within the system. This module selects a quote based on the date and optionally the user's personal preferences stored in the user profile. The response, containing the quote, is then formulated in JSON format and sent back to the client, ensuring that each interaction is tailored and secure.`,
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
