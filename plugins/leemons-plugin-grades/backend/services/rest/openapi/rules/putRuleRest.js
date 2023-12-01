const { schema } = require('./schemas/response/putRuleRest');
const { schema: xRequest } = require('./schemas/request/putRuleRest');

const openapi = {
  summary: 'Update an existing grading rule',
  description: `This endpoint allows for the modification of an existing grading rule within the system. It is responsible for updating rule details such as name, description, and the associated conditions and condition groups that define the grading logic.

**Authentication:** Users must be authenticated and possess a valid session token to interact with this endpoint. Unauthorized users will be prevented from accessing this functionality.

**Permissions:** The user must have appropriate permissions to modify grading rules, typically reserved for educational staff with administrative privileges or roles such as 'Instructor' or 'Administrator'.

Upon receiving a request, the handler begins by invoking the \`updateRule\` method from the \`rules\` core, which processes the incoming data to update the specified grading rule. It handles the deletion of old condition groups and conditions associated with the rule by calling \`removeConditionGroupsByRule\` and \`removeConditionsByRule\`. Subsequently, it adds new condition groups and conditions through \`addConditionGroup\` and \`addCondition\` methods. The flow continues with retrieval of the updated rule information using \`ruleByIds\` and \`getRuleConditionsByRuleIds\` methods to fetch the rule and its detailed conditions. Finally, the endpoint constructs a comprehensive response detailing the updated rule, which is returned to the user in JSON format.`,
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
