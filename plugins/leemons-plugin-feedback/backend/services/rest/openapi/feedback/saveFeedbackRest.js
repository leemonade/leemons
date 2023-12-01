const { schema } = require('./schemas/response/saveFeedbackRest');
const { schema: xRequest } = require('./schemas/request/saveFeedbackRest');

const openapi = {
  summary: 'Save user feedback on a specific feature or service',
  description: `This endpoint captures and processes user feedback for a specific feature or service in the application. It collects the user's input on their experience, satisfaction, or any comments they have, which can then be utilized for improving the product offerings.

**Authentication:** The endpoint requires users to be authenticated before submitting their feedback. Any attempts to access the endpoint without a valid session or authentication token will be rejected.

**Permissions:** Users must have the 'submit_feedback' permission assigned to their role. Without this permission, the user will not be allowed to save their feedback.

Upon invoking this endpoint, the \`saveFeedback\` method is called from the feedback core within the plugin, where it receives information such as the user's feedback details and metadata. The method validates the input using defined schemas and then commits the data to the feedback repository (usually a database or similar persistent store) associated with the user's account. The flow ensures feedback is recorded accurately and can be referenced or analyzed later. Responses are returned based on the outcome of the operation; successful saves return confirmation, while failures due to validation or permissions issues return relevant error messages.`,
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
