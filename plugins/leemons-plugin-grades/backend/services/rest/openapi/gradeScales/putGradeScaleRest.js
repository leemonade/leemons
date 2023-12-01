const { schema } = require('./schemas/response/putGradeScaleRest');
const { schema: xRequest } = require('./schemas/request/putGradeScaleRest');

const openapi = {
  summary: 'Update a specific grade scale',
  description: `This endpoint allows for the modification of an existing grade scale within the system. It is responsible for updating grade scale details such as its name, range, and the values associated with the grading system.

**Authentication:** Users must be authenticated to update grade scales. An attempt to access this endpoint without a valid session or authentication token will result in an error and the request will be denied.

**Permissions:** The user must have the 'update_grade_scale' permission to modify an existing grade scale. Without the appropriate permissions, the user will receive an error indicating insufficient privileges.

Upon receiving a request, the \`putGradeScaleRest\` handler initiates by validating the incoming data through predefined validation rules in 'forms.js'. If the validation succeeds, the \`updateGradeScale\` method from the 'grade-scales' core module is called with the required parameters, including the unique identifier of the grade scale to update and the new grade scale values. This method handles the business logic of updating the grade scale in the database. Upon successful update, a response with the updated grade scale is sent back to the client. If any error occurs during the process, an appropriate error message is returned instead.`,
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
