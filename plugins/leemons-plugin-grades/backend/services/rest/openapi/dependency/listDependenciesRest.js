const { schema } = require('./schemas/response/listDependenciesRest');
const { schema: xRequest } = require('./schemas/request/listDependenciesRest');

const openapi = {
  summary: 'List all dependency rules related to grading systems',
  description: `This endpoint lists the complete set of dependency rules associated with the grading systems within the platform. It is primarily used to manage and understand the interconnectivity and prerequisites of the grades within various courses or programs.

**Authentication:** Users need to be authenticated to access the list of dependency rules. Access to this endpoint will be restricted if the user's session is not properly authenticated with a valid token.

**Permissions:** Appropriate permissions are required to access this endpoint. Users must have rights to view or manage the grading system configurations in order to retrieve the list of grading dependencies.

Upon receiving a request, the \`listDependenciesRest\` handler calls the \`listRules\` method from the \`grades\` service. This method is responsible for compiling a comprehensive list of grading rules, which define the relationships between different grade entities. Following the retrieval of these rules from the backend storage, the handler then formats the data according to predefined structures for API responses. The formatted data is then returned to the requester, providing insights into the dependency structure of the grading systems.`,
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
