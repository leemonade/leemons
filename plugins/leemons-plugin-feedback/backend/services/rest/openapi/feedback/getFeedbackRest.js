const { schema } = require('./schemas/response/getFeedbackRest');
const { schema: xRequest } = require('./schemas/request/getFeedbackRest');

const openapi = {
  summary: 'Fetches feedback based on user and context',
  description: `This endpoint retrieves all feedback entries submitted by a user within a specific context, such as a course or a training session. It focuses on providing insights into the user's experiences and sentiments regarding the context in question.

**Authentication:** Users need to be authenticated to submit and retrieve their feedback. Without proper authentication, the endpoint will not grant access to the feedback data.

**Permissions:** Users must have the adequate permissions to view feedback. This typically requires permissions related to the feedback module, ensuring that only authorized individuals can query for feedback information.

The process begins with the \`getFeedbackRest\` action, which calls the \`getFeedback\` function from the \`feedback\` core module. Inside \`getFeedback\`, there might be several data validations to check the user's identity and context validity. Subsequently, a query is constructed to retrieve feedback entries from the database. These entries pertain to the user and the specified context. The method then processes the results, possibly by filtering and formatting the data, to be sent back to the client. The endpoint ultimately serves a detailed response containing the feedback entries in a structured format, often as a JSON object or array, including necessary metadata and content related to the user's provided feedback.`,
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
