const { schema } = require('./schemas/response/postRuleProcessRest');
const { schema: xRequest } = require('./schemas/request/postRuleProcessRest');

const openapi = {
  summary: 'Processes grading rules based on user actions',
  description: `This endpoint processes specific grading rules applicable to a user based on their actions within the platform. Depending on the conditions set up for each rule, this might include calculating grades, sending notifications, or adjusting user status.

**Authentication:** User authentication is required to ensure that the rule processing is applied to the correct user account. Actions conducted without proper authentication will not be processed.

**Permissions:** Users need to have sufficient permissions typically related to educational or administrative roles, for this endpoint to process grading rules on their behalf. Lack of required permissions will result in denial of service for the requested action.

Upon receiving a request, the endpoint initially validates the user’s authentication status and permissions. It then uses a series of service calls including \`processRulesForUserAgent\`, \`getRuleConditionsByRuleIds\`, \`getConditionsByRule\`, and \`getConditionGroupsByRule\` to fetch relevant rules and conditions. These functions collectively determine which rules are applicable based on the user's recent activities or input data. Once applicable rules are identified, the endpoint executes these rules, potentially updating grades, triggering notifications, or modifying user-related data based on the outcomes of the rule processes. Finally, the results of the rule processing are compiled and sent back as a response to the user in a structured format.`,
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
