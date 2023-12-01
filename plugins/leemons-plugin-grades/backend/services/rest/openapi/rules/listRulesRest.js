const { schema } = require('./schemas/response/listRulesRest');
const { schema: xRequest } = require('./schemas/request/listRulesRest');

const openapi = {
  summary: 'Lists all grading rules',
  description: `This endpoint provides a list of all grading rules configured in the system. The retrieved rules determine how grades are calculated and assigned based on various criteria and conditions set within the platform.

**Authentication:** Users must be authenticated to request the list of grading rules. The endpoint will reject requests that lack proper authentication credentials.

**Permissions:** Users need to have the 'view_grading_rules' permission to access this endpoint. Those without the necessary permission will receive an authorization error.

Upon receiving a request, the endpoint calls the \`listRules\` method from the \`rules\` core module. This method interacts with the database to fetch all the grading rules along with their related condition groups and individual conditions. After collecting the necessary data, it formats the response to include rule details such as rule name, criteria, and applicable conditions. The final response is returned to the client as a JSON object containing an array of grading rules with their respective attributes.`,
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
