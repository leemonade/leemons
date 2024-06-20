const { schema } = require('./schemas/response/setRest');
const { schema: xRequest } = require('./schemas/request/setRest');

const openapi = {
  summary: 'Set weight configuration for student assessments',
  description: `This endpoint sets or updates the weights associated with different components of student assessments within a given context. Weights determine how various elements contribute to the final calculation of a student's score.

**Authentication:** User authentication is required to access this endpoint. Unauthenticated requests will be rejected, ensuring that only authorized users can manage weight configurations.

**Permissions:** The user must have administrative privileges or specific permissions related to score management. Without the necessary permissions, the request will be denied, maintaining strict access control to sensitive operations.

Upon receiving a request, this endpoint first validates the input data using the \`validateWeight.js\` validator to ensure all provided values are correct and adhere to required formats. If validation fails, the endpoint immediately returns an error response. If validation is successful, the \`setWeight.js\` method in the \`weights\` core is called with the passed data. This method handles the logic of adding or updating weight entries in the database, ensuring data integrity and applying any required business logic. On successful completion, the endpoint returns a success message, and in cases of failure, it provides a detailed error message to help diagnose the issue.`,
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
