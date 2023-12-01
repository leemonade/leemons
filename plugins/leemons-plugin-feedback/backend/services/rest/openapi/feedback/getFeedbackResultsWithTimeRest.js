const { schema } = require('./schemas/response/getFeedbackResultsWithTimeRest');
const {
  schema: xRequest,
} = require('./schemas/request/getFeedbackResultsWithTimeRest');

const openapi = {
  summary: 'Fetches detailed feedback results with timestamp information',
  description: `This endpoint is responsible for retrieving comprehensive feedback results along with their respective timestamps. The data returned typically includes feedback responses, submission times, and may also aggregate scores or statistics if applicable.

**Authentication:** User needs to be authenticated to access the feedback results. The endpoint requires a valid session or authentication token.

**Permissions:** The user must have the right permissions to view the feedback results. This usually includes roles such as administrators, instructors, or specific privileges granted to the user within the feedback system.

Upon receiving a request, the handler first checks for user authentication and permissions. It then calls the \`getFeedbackResultsWithTime\` function from the \`feedback-responses\` core module. This function takes the necessary parameters from the request, such as feedback identifiers, time ranges, or user information, and queries the feedback database for the relevant results. These results are processed and timestamp data is appended as required. Finally, the endpoint compiles the data into a structured JSON response that is sent back to the client with appropriate HTTP status codes.`,
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
