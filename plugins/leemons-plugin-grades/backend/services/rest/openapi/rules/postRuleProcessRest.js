const { schema } = require('./schemas/response/postRuleProcessRest');
const { schema: xRequest } = require('./schemas/request/postRuleProcessRest');

const openapi = {
  summary: 'Process grading rules for a specified user agent',
  description: `This endpoint processes and applies grading rules specific to a user agent, such as a student or class, within the educational platform. It evaluates the conditions attached to the grading rules and computes the results accordingly.

**Authentication:** Users must be logged in to initiate the processing of grading rules for user agents. Without proper authentication, the endpoint cannot be accessed and will not execute the grading rule processing logic.

**Permissions:** The user must have the permission to manage or view grades within the system. Without the appropriate permissions, the user will not have the authority to execute or inquire about the grading rules process.

The flow begins with the \`postRuleProcessRest\` handler in the \`rules.rest.js\` service file, which captures the incoming request. It delegates the task to the \`processRulesForUserAgent\` core method, passing the necessary parameters extracted from the request payload. This method interacts with multiple core components, such as 'getRuleConditionsByRuleIds' to fetch applicable conditions, 'getConditionsByRule' and 'getConditionGroupsByRule' to organize the rule logic, and 'getUserAgentNotesForSubjects' to collect any relevant notes or annotations. The core logic consists of evaluating each rule's conditions against the current state of the user agent to determine if and how the rules apply. The final output consists of executing the actions dictated by the rules that have their conditions satisfied, affecting the user agent's grading data. The result of this process is a structured response that conveys the outcome of the applied grading rules.`,
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
