const { schema } = require('./schemas/response/putGradeTagRest');
const { schema: xRequest } = require('./schemas/request/putGradeTagRest');

const openapi = {
  summary: 'Update a specified grade tag',
  description: `This endpoint allows for the updating of a specific grade tag’s details in the system. Modifications can include changes to the grade tag’s name, description, or other relevant attributes provided in the request payload.

**Authentication:** Users must be logged in to perform updates on grade tags. An unauthorized request will be rejected.

**Permissions:** Users are required to have the 'edit_grade_tags' permission in their role configuration. Without the necessary permission, the endpoint will deny access to the grade tag update functionality.

Upon receiving a request, the handler begins by validating the incoming data using the schema defined in 'validations/forms.js'. If validation succeeds, it then calls the 'updateGradeTag' method from the 'grade-tags' core, providing the necessary tag ID and update data. This method handles the update logic, which may include database transactions to ensure the grade tag is modified correctly in the persistent store. Once the update operation is complete, a response is returned to the client with either a success message or relevant error information, depending on the outcome of the operation.`,
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
