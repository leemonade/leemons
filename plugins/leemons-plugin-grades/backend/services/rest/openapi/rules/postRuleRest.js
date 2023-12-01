const { schema } = require('./schemas/response/postRuleRest');
const { schema: xRequest } = require('./schemas/request/postRuleRest');

const openapi = {
  summary: 'Create or update grading rules',
  description: `This endpoint is responsible for adding or updating rules used for grading within the system. It facilitates the creation of new grading criteria or the modification of existing ones to reflect changes in grading policies or procedures.

**Authentication:** Users must be authenticated to modify grading rules. Only requests from authenticated sessions will be processed, while unauthenticated requests will be rejected.

**Permissions:** Users must have the appropriate permissions to create or update grading rules. The action requires administrative level permissions, or specific roles granted the capability to manage academic grading configurations.

Upon receiving a request, the \`postRuleRest\` handler begins the process by validating input parameters against predefined schemas to ensure all required rule data is present and correctly formatted. It then proceeds to call the \`addRule\` method from the \`rules\` core, passing in the rule data. This method is responsible for either inserting a new rule into the database or updating an existing one if an identifier is provided. The method involves complex business logic, including evaluating conditions and manipulating condition groups associated with the rules. After the operation is successful, the endpoint returns a status code indicating the creation or update of the rule along with any relevant rule details in the response body.`,
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
