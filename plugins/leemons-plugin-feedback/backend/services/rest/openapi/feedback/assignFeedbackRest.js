const { schema } = require('./schemas/response/assignFeedbackRest');
const { schema: xRequest } = require('./schemas/request/assignFeedbackRest');

const openapi = {
  summary: 'Assign feedback to a specific target',
  description: `This endpoint assigns user-generated feedback to a particular item or service within the platform. The functionality encapsulates user engagement by allowing feedback submissions to be directly attached to specific targets identified within the system.

**Authentication:** Users need to be authenticated to submit feedback. The system checks for a valid session or token before processing the request.

**Permissions:** The user must have the 'submit_feedback' permission to perform this action. Access without sufficient permissions will result in a denial of service error.

The process initiates with the \`assignFeedback\` method in the feedback core service. This method receives information about the feedback such as the target ID and the feedback details. It performs validation checks to ensure data integrity and compliance with established standards. Subsequently, the method interacts with the database backend to record the submitted feedback against the specified target, ensuring that all referencing and data relationships are properly maintained. The completion of the operation results in a confirmation response that the feedback has been successfully assigned, including any relevant metadata related to the assignment.`,
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
