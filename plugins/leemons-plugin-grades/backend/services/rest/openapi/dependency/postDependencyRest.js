const { schema } = require('./schemas/response/postDependencyRest');
const { schema: xRequest } = require('./schemas/request/postDependencyRest');

const openapi = {
  summary: 'Manage grading dependencies',
  description: `This endpoint is responsible for creating or updating dependencies related to the grading system within the application. Dependencies may include, but are not limited to, associations between various grading rules, condition groups, and conditions that together define the logic for grading within the platform.

**Authentication:** Users must be authenticated to modify the grading dependencies. Unauthenticated requests will be rejected and the user will be prompted to log in.

**Permissions:** Users need to have adequate permission levels, typically administrative rights, to manage grading dependencies. Without the proper permissions, the request will be denied.

Upon receipt of the request, the \`postDependencyRest\` action is invoked which then delegates the task to an internal method, perhaps labeled \`createOrUpdateDependency\`. This method would handle the validation of input data (using schemas defined in \`validations/forms.js\`) and orchestrate the creation or update process by calling other service methods such as \`addRule\` from \`core/rules/addRule.js\`, \`addConditionGroup\` from \`core/condition-groups/addConditionGroup.js\`, and \`addCondition\` from \`core/conditions/addCondition.js\`. The service methods collaborate to ensure dependencies are set up or modified correctly, taking into account any pre-existing rules, condition groups, and conditions fetched from database operations through methods like \`ruleByIds\`, \`getRuleConditionsByRuleIds\`, \`getConditionsByRule\`, and \`getConditionGroupsByRule\`. The result is then formatted and sent back as a response to the client, indicating the successful handling of grading dependencies.`,
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
