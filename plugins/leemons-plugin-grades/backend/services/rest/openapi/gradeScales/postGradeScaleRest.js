const { schema } = require('./schemas/response/postGradeScaleRest');
const { schema: xRequest } = require('./schemas/request/postGradeScaleRest');

const openapi = {
  summary: 'Add a new grade scale',
  description: `This endpoint is responsible for adding a new grade scale to the system. It allows for defining a grading scale that will be used to evaluate student performance in various courses.

**Authentication:** Users must be authenticated to create a new grade scale. Unauthenticated requests will be rejected.

**Permissions:** The user needs to have 'add_grade_scale' permission to create a new grade scale. Without the appropriate permissions, the endpoint will return an access denied error.

Upon receiving a \`POST\` request, the handler calls the \`addGradeScale\` method from the \`grade-scales\` core module. It checks for the required fields and structure of the grade scale data submitted in the request body. After validation, it initiates the transaction to store the new grade scale in the database. If the operation is successful, it sends back a confirmation message along with the details of the created grade scale. On failure, it responds with an error message detailing the reason for the failure.`,
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
