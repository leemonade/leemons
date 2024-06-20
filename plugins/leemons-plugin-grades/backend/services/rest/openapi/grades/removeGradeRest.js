const { schema } = require('./schemas/response/removeGradeRest');
const { schema: xRequest } = require('./schemas/request/removeGradeRest');

const openapi = {
  summary: 'Remove a specific grade entry from the system',
  description: `This endpoint is responsible for deleting a grade record by its unique identifier. The process ensures that all associated data, such as grade tags and grade scales, are also removed accordingly, ensuring data consistency across the platform.

**Authentication:** Users must be authenticated to perform removal operations. This ensures that only authorized users can delete grade data.

**Permissions:** The user must have the 'delete_grade' permission to execute this action. This permission check is crucial to prevent unauthorized data manipulation and maintain system security.

Upon receiving a request to delete a grade, the endpoint first checks for the required permissions. If permissions are validated, it proceeds to invoke the \`removeGrade\` method from the \`grades\` core, which handles the deletion of the grade record from the database. Simultaneously, related data such as grade tags and scales are dealt with through respective removal methods: \`removeGradeTagsByGrade\` and \`removeGradeScaleByGrade\`. These methods ensure that all traces of the grade are completely eradicated from the database, maintaining the integrity and cleanliness of the data. The response to the client confirms the successful removal of the grade and associated data, marking the complete termination of the entry.`,
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
