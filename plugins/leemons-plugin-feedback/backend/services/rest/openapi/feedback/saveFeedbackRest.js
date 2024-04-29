const { schema } = require('./schemas/response/saveFeedbackRest');
const { schema: xRequest } = require('./schemas/request/saveFeedbackRest');

const openapi = {
  summary: 'Saves user feedback for a specific query or service',
  description: `This endpoint allows users to submit feedback related to a specific part of the platform or service. The feedback data collected can include ratings, textual feedback, or other forms of user input related to their experience with the platform.

**Authentication:** Users need to be authenticated to submit feedback. Only authenticated user sessions can post feedback, ensuring that feedback can be associated with a specific user account.

**Permissions:** The user must have permission to access the specific service or platform component about which they are providing feedback. The required permissions depend on the organization's or platform's specific configuration and access control settings.

The \`saveFeedbackRest\` handler begins by validating the incoming data against predefined schemas to ensure all required fields are present and correctly formatted. Then, it invokes the \`saveFeedback\` method from the \`Feedback\` core service. This method deals with the business logic for saving the feedback into the system's database, including any necessary processing or transformation of feedback data. The process involves logging the feedback entry along with the user's details and the context of the feedback (e.g., the specific part of the service the feedback addresses). Once the feedback is successfully saved, a confirmation is sent back to the user in the form of a JSON response indicating the successful storage of their feedback.`,
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
