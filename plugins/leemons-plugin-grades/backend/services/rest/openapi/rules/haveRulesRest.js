const { schema } = require('./schemas/response/haveRulesRest');
const { schema: xRequest } = require('./schemas/request/haveRulesRest');

const openapi = {
  summary: 'Check existence of grading rules',
  description: `This endpoint checks whether grading rules have been defined for a specified context, such as a course or an educational program. The presence or absence of such rules determines the next steps in the grading process.

**Authentication:** Users must be authenticated to query grading rules. Unauthorized access will be prevented, ensuring that only authenticated users can perform this check.

**Permissions:** Necessary permissions to access grading rules details are required. Users without the proper permissions will be restricted from querying this information.

Upon receiving a request, the \`haveRulesRest\` handler initiates the process by calling \`haveRules\` from the \`rules\` core. This function examines the relevant database entries or configuration files to verify the existence of grading rules within the given context. The checks are performed against predefined criteria specific to the system's grading logic. If rules are found, the endpoint responds affirmatively; if not, a negative response is returned. The entire flow is designed to be swift and effective, providing a binary answer essential for grading decision processes.`,
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
