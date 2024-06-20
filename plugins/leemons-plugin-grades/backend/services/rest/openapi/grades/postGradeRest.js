const { schema } = require('./schemas/response/postGradeRest');
const { schema: xRequest } = require('./schemas/request/postGradeRest');

const openapi = {
  summary: 'Add a new grade entry to the system',
  description: `This endpoint allows for the creation of a new grade entry in the grading system. It is designed to receive grade details, validate them, and store them in the database accordingly.

**Authentication:** User authentication is mandatory for accessing this endpoint. A valid user session or token is required to ensure that the request is authorized.

**Permissions:** The user needs to have 'grade_add' permission to perform this action. Without the required permissions, the request will be rejected, and an error message will be returned.

The process begins with the 'postGradeRest' action that first validates the incoming request data against predefined schemas to ensure that all required fields are present and correctly formatted. Upon successful validation, the action then calls the 'addGrade' method from the 'grades' core module. This method takes responsibility for integrating the new grade data into the database. During this operation, it checks for any duplicate entries or conflicting data to maintain data integrity. Once the grade is successfully added to the database, a confirmation message is sent back to the user.`,
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
