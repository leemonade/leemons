const { schema } = require('./schemas/response/postGradeTagRest');
const { schema: xRequest } = require('./schemas/request/postGradeTagRest');

const openapi = {
  summary: 'Adds a new grade tag to the system',
  description: `This endpoint adds a new grade tag to the system, which can then be associated with various grading entities within the application.

**Authentication:** This operation requires the user to be authenticated in order to ensure that only legitimate users can add grade tags.

**Permissions:** A specific permission level is required to add grade tags. The user must have the 'manage_grade_tags' permission or equivalent administrative rights to perform this action.

The endpoint flow involves several core methods. It begins with validating the request data using the schemas defined in '/backend/validations/forms.js'. Upon successful validation, the \`addGradeTag\` method from '/backend/core/grade-tags/index.js' is called, which in turn uses the implementation in '/backend/core/grade-tags/addGradeTag.js' to interact with the database and create a new grade tag record. Errors during validation or database operations are handled and relevant error responses are generated. On successful addition of the grade tag, a response containing the details of the newly created grade tag is returned to the client.`,
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
