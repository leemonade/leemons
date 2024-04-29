const { schema } = require('./schemas/response/setQuestionResponseRest');
const {
  schema: xRequest,
} = require('./schemas/request/setQuestionResponseRest');

const openapi = {
  summary: "Records a user's response to feedback-related questions",
  description: `This endpoint allows for the recording and updating of a user's responses to specific feedback questions presented within the platform. It provides a critical interaction within the user feedback loop, capturing valuable insights from users about various aspects of product or service usability, satisfaction, and overall experience.

**Authentication:** Users need to be authenticated to submit their responses. The authentication verifies user identity and ensures that responses are correctly attributed to the user's account.

**Permissions:** The user must have the 'feedback-response:create' permission to post new responses and 'feedback-response:edit' to update their existing responses. These permissions ensure that only authorized users can interact with feedback mechanisms accordingly.

Upon receiving a request, the endpoint firstly checks the user's authentication status and permissions. If these checks are passed, the \`setQuestionResponse\` service method is invoked with parameters that identify the specific question and capture the user’s response. This method handles the intricate details of storing or updating the response data in the database. The process includes validation of the input data to comply with expected formats and constraints. Finally, an appropriate response is generated and sent back to the client, indicating the success or failure of the operation.`,
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
