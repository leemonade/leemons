const { schema } = require('./schemas/response/addStatementRest');
const { schema: xRequest } = require('./schemas/request/addStatementRest');

const openapi = {
  summary: 'Add a new xAPI statement',
  description: `This endpoint is responsible for recording a new xAPI statement to track learning experiences. The xAPI statement is a structured record that describes a learning activity, event, or experience according to the Experience API specification.

**Authentication:** Users must be authenticated in order to post new xAPI statements. The system will validate the user's credentials before processing the request.

**Permissions:** Users need to have the 'xapi:add' permission to add new xAPI statements. Without this permission, the endpoint will reject the request with an appropriate error message.

This endpoint calls upon the \`addStatement\` method from the \`statement\` core logic. Initially, the request payload containing the xAPI statement data is validated against predefined rules set in \`forms.js\` to ensure it meets structural and content requirements for xAPI statements. After validation, the \`addStatement\` method orchestrates the process of persisting the statement into the system's data store, handling any required transformations or additional logic as needed. Finally, it responds back to the requester with the outcome of operation, which includes confirmation of the recorded statement or details regarding any encountered errors.`,
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
