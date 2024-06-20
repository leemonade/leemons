const { schema } = require('./schemas/response/getFeedbackResultsWithTimeRest');
const {
  schema: xRequest,
} = require('./schemas/request/getFeedbackResultsWithTimeRest');

const openapi = {
  summary: 'Retrieve feedback results over time',
  description: `This endpoint fetches a series of feedback results, aggregated over a specified time period. The data retrieved can be used to analyze trends and patterns in feedback over time, aiding in comprehensive assessments and strategic planning.

**Authentication:** Users must be authenticated to access this endpoint. Access attempts with invalid or missing authentication credentials will be rejected.

**Permissions:** This endpoint requires users to have specific permissions related to feedback analysis. Users without the necessary permissions will not be able to retrieve feedback result data.

The processing of this request begins when the \`getFeedbackResultsWithTimeRest\` action is called in the service module. Initially, the request parameters specifying the time period are parsed. Following this, the \`getFeedbackResultsWithTime\` method from the 'feedback-responses' core module is invoked with these parameters. This method is responsible for querying the database to retrieve feedback data that fits the provided timeframe, processing it, and preparing it for a response. The result is then returned as a JSON object that encapsulates the feedback data, formatted to highlight key trends and statistics over the requested period.`,
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
