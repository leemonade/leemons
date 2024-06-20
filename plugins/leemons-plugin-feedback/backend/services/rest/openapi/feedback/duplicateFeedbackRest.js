const { schema } = require('./schemas/response/duplicateFeedbackRest');
const { schema: xRequest } = require('./schemas/request/duplicateFeedbackRest');

const openapi = {
  summary: 'Duplicate specific feedback item',
  description: `This endpoint duplicates a specific feedback item based on the provided feedback ID. It is typically used in scenarios where feedback mechanisms need to replicate existing entries whilst retaining the original data integrity.

**Authentication:** Users need to be authenticated to perform this duplication operation. Failing to provide valid authentication credentials will result in rejection of the request.

**Permissions:** Users must have the 'duplicate_feedback' permission granted to execute this operation. The permission checks ensure that only authorized users can make duplications, adhering to the system's security protocols.

Upon receiving a request with a valid feedback ID, the \`duplicateFeedback\` method in the feedback core is triggered. This method is responsible for first verifying that the feedback ID exists and that the user has the appropriate permissions to duplicate it. It then proceeds to create a copy of the original feedback, ensuring all linked information, such as feedback questions and responses, are correctly replicated. The process involves several transactional database operations to maintain data consistency and integrity. Finally, the endpoint responds with the new feedback ID of the duplicated item, confirming the successful operation.`,
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
