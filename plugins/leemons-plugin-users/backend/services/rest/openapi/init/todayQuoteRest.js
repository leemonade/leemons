const { schema } = require('./schemas/response/todayQuoteRest');
const { schema: xRequest } = require('./schemas/request/todayQuoteRest');

const openapi = {
  summary: 'Provides the quote of the day for the user',
  description: `This endpoint delivers a motivational or inspirational quote that changes daily. Designed to offer users a positive start to their day, the quote is randomly selected each day from a curated collection.

**Authentication:** User must be authenticated to receive the daily quote, ensuring that the feature is personalized and the usage is tracked against a user profile.

**Permissions:** The user must have the 'view_quotes' permission to access this endpoint. This ensures that only users with appropriate rights within the system can retrieve the quote of the day.

Upon receiving a request, the handler first verifies the user's authentication status and permissions through the system's security protocols. If authenticated and permitted, the handler proceeds to call the \`getTodayQuote\` method, which is responsible for fetching the quote of the day from the database or external service. This operation might involve algorithms to ensure the quote is relevant and not repetitive. The response, when successful, includes the quote in a structured JSON format, typically with fields for 'text', 'author', and 'context', if applicable. The result is then passed back to the requester as the HTTP response body.`,
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
