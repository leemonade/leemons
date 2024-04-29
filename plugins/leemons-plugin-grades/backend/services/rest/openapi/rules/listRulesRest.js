const { schema } = require('./schemas/response/listRulesRest');
const { schema: xRequest } = require('./schemas/request/listRulesRest');

const openapi = {
  summary: 'List all grading rules',
  description: `This endpoint lists all grading rules defined in the system. It pulls data regarding different grading criteria that have been set up to evaluate learners' performance across various courses or assessments.

**Authentication:** Users must be authenticated to access the list of grading rules. Unauthorized access attempts will be blocked at the API gateway level.

**Permissions:** The user needs to have 'view_grading_rules' permission to query this endpoint. This ensures that only authorized personnel with the requisite permissions can view the grading configurations.

Upon request, the handler initiates by invoking the \`listRules\` method from the Grades plugin's Rules core service. This method queries the database for all rule entries that define how grades should be calculated or awarded based on predefined conditions. Each rule might include specific conditions or criteria, which are also fetched by subsequent calls to \`getConditionsByRule\` or \`getConditionGroupsByRule\`, thus assembling a complete set of data pertaining to each rule. Finally, the fetched rules and their detailed specifications are compiled into a structured format and returned as a JSON response, ensuring the client receives comprehensive data on grading rules.`,
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
