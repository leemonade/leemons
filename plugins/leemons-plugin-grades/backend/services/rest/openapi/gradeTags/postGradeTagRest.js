const { schema } = require('./schemas/response/postGradeTagRest');
const { schema: xRequest } = require('./schemas/request/postGradeTagRest');

const openapi = {
  summary: 'Add a new grade tag',
  description: `This endpoint allows for the creation of a new grade tag within the system, enabling categorization or tagging of grades based on predefined criteria.

**Authentication:** User must be authenticated to create a new grade tag. Any API call without a valid authentication token will be rejected.

**Permissions:** Users need to have 'manage_grade_tags' permission to execute this action. Without sufficient permissions, the request will be denied.

Upon receiving a POST request at this endpoint, the \`addGradeTag\` function within the 'grade-tags' core module is invoked. This function is responsible for processing input parameters which define the properties of the grade tag (e.g., tag name, description, associated curriculum). It performs validation to ensure all required fields are present and correctly formatted. Following successful validation, the function attempts to create a new tag in the database. If the creation is successful, a confirmation message or the newly created tag's details are sent back to the client in the response. If there is an error during the creation process (such as duplicate tag names or database issues), an appropriate error message is relayed back to the client.`,
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
