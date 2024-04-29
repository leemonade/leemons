const { schema } = require('./schemas/response/haveRulesRest');
const { schema: xRequest } = require('./schemas/request/haveRulesRest');

const openapi = {
  summary: 'Checks the applicability of grading rules for a specific context',
  description: `This endpoint assesses the application of defined grading rules within a given educational or testing scenario. It verifies whether certain grading criteria are met and determines the applicability of rules based on the context provided in the request.

**Authentication:** User authentication is required to ensure that only authorized personnel can check and apply grading rules. An attempt to access this endpoint without a valid authentication token will result in denial of access.

**Permissions:** This endpoint requires the user to have permissions to manage or view grading settings within the platform. Users without sufficient permissions will not be able to execute or view the results of this rule check.

Upon receiving a request, the endpoint first validates user authentication and permissions. If these checks pass, it then proceeds to invoke the \`haveRules\` method from the \`rules\` core. This method analyzes the context provided — such as academic level, department, or specific test details — and retrieves all applicable grading rules from the database. It evaluates these rules to determine if they are applicable to the provided scenario, using a set of predefined logic criteria. The result of this process is a decision on whether the rules can be applied, along with any necessary details explaining the reasoning. This response is then serialized into JSON format and sent back to the requester, providing clear information on rule applicability.`,
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
