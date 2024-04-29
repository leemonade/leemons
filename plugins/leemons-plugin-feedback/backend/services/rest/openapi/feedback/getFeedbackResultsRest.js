const { schema } = require('./schemas/response/getFeedbackResultsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getFeedbackResultsRest');

const openapi = {
  summary: 'Collect feedback results aggregated by specified criteria',
  description: `This endpoint aggregates and returns feedback results based on specific criteria such as survey ID, question type, or participant demographics. The aggregation helps in analyzing the feedback comprehensively.

**Authentication:** Users must be authenticated to request feedback results. The endpoint validates the session or token provided for authentication before proceeding with the request.

**Permissions:** Users need to have 'read_feedback' permission to access this data. Depending on the organization's settings, additional permissions related to data sensitivity might be enforced.

The processing begins with the retrieval of parameters specifying which feedback items need to be aggregated. It uses the \`getFeedbackResults\` function from the \`feedback-responses\` module, which fetches and computes the results based on the given criteria. This function consults several data sources, processes the data, and finally, prepares an aggregated result set. The results are then formatted into a structured response and sent back to the client as JSON. This method ensures that all data retrieval and processing are secure and efficient, adhering to the required data privacy standards.`,
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
