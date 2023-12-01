const { schema } = require('./schemas/response/assignFeedbackRest');
const { schema: xRequest } = require('./schemas/request/assignFeedbackRest');

const openapi = {
  summary: 'Assign feedback to a user or item',
  description: `This endpoint is responsible for assigning feedback to a specific user or item within the system. The operation allows for tracking and management of feedback entries, ensuring they are directed to the correct entities for processing and action.

**Authentication:** Users are required to be logged in to assign feedback. The endpoint will reject requests from unauthenticated sessions.

**Permissions:** The user must have the 'feedback.assign' permission to assign feedback. Without this permission, the request will be denied, affirming that only authorized personnel can allocate feedback appropriately.

Upon receiving a request, the \`assignFeedbackRest\` method within the \`feedback.rest.js\` service file is called. This method acts as an entry point to delegate the task to the \`assignFeedback\` function located in the \`assignFeedback.js\` core module. The \`assignFeedback\` function takes details of the feedback and the target user or item, performs validation of the assignment details, and then proceeds to update the relevant records in the database. This process links the feedback to the intended recipient, allowing for subsequent reviewal and action. The response to the client confirms the successful assignment of the feedback with the relevant details or returns an error if the assignment could not be processed.`,
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
