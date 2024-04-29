const { schema } = require('./schemas/response/listDependenciesRest');
const { schema: xRequest } = require('./schemas/request/listDependenciesRest');

const openapi = {
  summary: 'List all grade-related dependencies',
  description: `This endpoint lists all the dependencies associated with the grading system in the platform. It serves to provide a comprehensive overview of elements that impact or contribute to the construction of grades.

**Authentication:** Users need to be authenticated to access the dependencies of the grading system. The request will be denied if the authentication credentials are not provided or are invalid.

**Permissions:** Users must have the 'manage_grades' permission to view all the grading dependencies. Without sufficient permissions, access to this information will be restricted.

Upon receiving a request, this endpoint calls the \`listDependencies\` method from the \`GradesService\`. This method performs a query to retrieve all dependency records related to the grades system from the database. The results are then compiled into a structured list that shows how different grading systems, conditions, and rules are interconnected. Finally, the endpoint returns this list in a structured JSON format, providing clients with clear insights into the dependencies shaping the grading processes.`,
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
