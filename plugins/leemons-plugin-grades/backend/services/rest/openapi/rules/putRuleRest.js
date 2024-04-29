const { schema } = require('./schemas/response/putRuleRest');
const { schema: xRequest } = require('./schemas/request/putRuleRest');

const openapi = {
  summary: 'Update a specified grading rule',
  description: `This endpoint facilitates the update of a specific grading rule in the system. The rule details can be modified based on the provided inputs in the request, which include changes to conditions, condition groups, and other associated elements of the grading rule.

**Authentication:** The user must be authenticated to update a grading rule. An invalid or absent authentication token will restrict access to this endpoint.

**Permissions:** Appropriate permissions are required to update grading rules. The user must have administrative rights or specific permission flags set, such as 'update_grading_rule', to modify existing grading rules.

Upon receiving a request, the \`updateRule\` action is called within the rules service. This action orchestrates a series of operations involving validation of input data against predefined schemas, removal of existing condition groups and conditions linked to the rule through \`removeConditionGroupsByRule\` and \`removeConditionsByRule\` respectively, and addition of new conditions and groups if provided, using the \`addCondition\` and \`addConditionGroup\` methods. Finally, the updated rule is fetched with its new configuration and conditions using \`ruleByIds\` to ensure the update was successful and the new setup is returned in the response in a consumable format.`,
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
