const { schema } = require('./schemas/response/getFeedbackResultsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getFeedbackResultsRest');

const openapi = {
  summary: 'Collect and summarize feedback results',
  description: `This endpoint gathers feedback from various sources and compiles the data to generate an aggregated result summary. The results encompass quantitative analysis and qualitative insights, allowing for a comprehensive understanding of the feedback provided.

**Authentication:** Only authenticated users can request the summarization of feedback results. Unauthenticated access will be denied, ensuring that only eligible users can perform this action.

**Permissions:** Users need to have the appropriate permission level to view or manage feedback results. This is critical to ensure that access to feedback data is controlled and complies with data privacy standards and organizational policies.

Upon request, the \`getFeedbackResultsRest\` action in the \`feedback.rest.js\` file initiates the process by calling the \`getFeedbackResults\` function from the \`feedback-responses\` core module. This function takes the necessary parameters and conducts a series of operations, including querying a database, applying analytical methods, and formatting the data into a structured response. The flow transitions seamlessly from receiving the HTTP request to processing the feedback and culminates in returning a detailed JSON object that encapsulates the feedback results, which is then served back to the requesting client.`,
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
