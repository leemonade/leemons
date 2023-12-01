const { schema } = require('./schemas/response/putGradeRest');
const { schema: xRequest } = require('./schemas/request/putGradeRest');

const openapi = {
  summary: 'Update the grade information',
  description: `This endpoint updates an existing grade item's details such as the score, feedback, and any associated metadata. The operation allows for modifications to an existing grade record in the system, ensuring that grade information is current and reflects any changes that may have occurred post evaluation.

**Authentication:** User authentication is required to ensure that only authorized personnel can modify grade records. Attempts to update a grade without proper authentication will be rejected.

**Permissions:** This endpoint requires the user to have permissions to update grade information. Users without sufficient privileges to modify grades will be prevented from making changes to the grade records.

On receiving the update request, the endpoint initially calls the \`updateGrade\` method within the \`grades\` core module. This method is responsible for handling the validation and processing of the request data. It updates the relevant grade item using the data provided in the request payload. If the update is successful, the method will return the updated grade information, which includes the new values for score, feedback, and any additional grade-related details. The HTTP response will then contain this updated information to confirm the changes to the client.`,
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
