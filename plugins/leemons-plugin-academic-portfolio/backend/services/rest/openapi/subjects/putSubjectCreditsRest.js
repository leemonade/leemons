const { schema } = require('./schemas/response/putSubjectCreditsRest');
const { schema: xRequest } = require('./schemas/request/putSubjectCreditsRest');

const openapi = {
  summary: 'Update subject credits',
  description: `This endpoint updates the credit value for a specific subject within the academic portfolio. It allows for the modification of credits attributed to a course or subject, which may be necessary due to curriculum changes or administrative adjustments.

**Authentication:** User authentication is mandatory to access this endpoint. Only requests with a valid authentication token will be processed, ensuring that only authorized personnel can modify subject credit information.

**Permissions:** The user must have the required permissions to alter academic subject details. This typically includes roles such as administrators or academic staff who are responsible for managing course content and structure within the institution.

The request handling begins by validating the provided input against a predefined schema to ensure that it contains the necessary and correctly formatted data. This validation is typically performed by the function referenced in \`validations/forms.js\`. After successful validation, the process continues to the \`setSubjectCredits\` function which is located in \`core/subjects/setSubjectCredits.js\`. This function is responsible for updating the credit value in the database. It takes the subject identifier and the new credit value from the request and applies the update, often involving a transaction to ensure data integrity. Upon completion, the handler generates a response indicating success or failure of the credit update operation, and the updated information is returned to the client.`,
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
