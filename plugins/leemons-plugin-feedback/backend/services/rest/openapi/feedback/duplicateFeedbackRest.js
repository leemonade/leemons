const { schema } = require('./schemas/response/duplicateFeedbackRest');
const { schema: xRequest } = require('./schemas/request/duplicateFeedbackRest');

const openapi = {
  summary: 'Duplicate existing feedback entries',
  description: `This endpoint allows for the duplication of feedback entries. It is designed to create exact copies of specified feedback records, maintaining the original content and structure of the feedback data but generating new unique identifiers for the duplicated items.

**Authentication:** Users are required to be logged in to access this functionality. An attempt to access the endpoint without proper authentication will result in access being denied.

**Permissions:** Adequate permissions are necessary to duplicate feedback entries. Users must possess the necessary rights to create feedback records, and any attempt to duplicate feedback without the appropriate permissions will be rejected.

Upon receiving a request, the \`duplicateFeedbackRest\` handler in \`feedback.rest.js\` calls the \`duplicateFeedback\` function from the \`feedback\` core module. This function is responsible for firstly validating that the provided feedback IDs correspond to existing entries and then proceeding to create new entries that are identical to the originals, except for their IDs. After duplication, it returns the new feedback entries to the client. Throughout this process, various checks are made to ensure that the user is authorized and that the feedback entries exist and can be duplicated. The final response to the client includes the details of the newly created duplicated feedback entries.`,
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
