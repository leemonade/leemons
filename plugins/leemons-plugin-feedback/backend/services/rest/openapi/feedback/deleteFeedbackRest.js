const { schema } = require('./schemas/response/deleteFeedbackRest');
const { schema: xRequest } = require('./schemas/request/deleteFeedbackRest');

const openapi = {
  summary: 'Delete specific user feedback',
  description: `This endpoint allows the deletion of a specific feedback entry. The action is performed by the user and targets a single feedback item identified by its unique identifier.

**Authentication:** Users need to be authenticated to carry out the deletion of feedback. Without proper authentication, the request will not be processed.

**Permissions:** Specific permissions related to feedback management are required for a user to delete feedback. Users without the proper permissions will be unable to perform this action.

Upon receiving the request, the \`deleteFeedbackRest\` handler calls the \`deleteFeedback\` function from the feedback core logic layer. This function is responsible for performing the actual deletion of the feedback item in the database. It ensures that all related data, such as feedback responses and metadata, is properly removed. The handler undertakes necessary checks to ensure that the user is authorized to delete the feedback entry, taking into account the user's authentication state and permission level. After successful deletion, a response is sent back to the user indicating that the operation has been completed.`,
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
