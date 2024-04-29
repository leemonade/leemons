const { schema } = require('./schemas/response/postRuleRest');
const { schema: xRequest } = require('./schemas/request/postRuleRest');

const openapi = {
  summary: 'Add a new grading rule',
  description: `This endpoint allows for the addition of a new grading rule within the system. The endpoint facilitates the creation of complex grading rules which can be associated with particular grades, subjects, or other academic criteria.

**Authentication:** User authentication is required to ensure only authorized personnel can add or modify grading rules. A valid user session is needed to proceed with this operation.

**Permissions:** This operation requires the user to have the 'manage_grading_rules' permission assigned. Without the proper permissions, the request will be rejected.

Upon receiving a request, the endpoint first processes the input parameters to validate the structure and data of the grading rule. It then calls the \`addRule\` function from the \`rules\` core backend service. This function handles the insertion of the new rule data into the database, ensuring all associated conditions and condition groups are correctly linked. Once the addition is successful, a response is generated and sent back to the requester, confirming the creation of the rule. If there are any issues during the process, appropriate error messages are returned, guiding the user to resolve such issues.`,
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
