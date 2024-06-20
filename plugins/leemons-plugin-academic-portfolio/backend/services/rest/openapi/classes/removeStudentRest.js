const { schema } = require('./schemas/response/removeStudentRest');
const { schema: xRequest } = require('./schemas/request/removeStudentRest');

const openapi = {
  summary: 'Removes a student from an academic class',
  description: `This endpoint is responsible for removing a specific student from a designated academic class. The targeted student is disassociated from the class records in the database, effectively updating the class's enrollment status.

**Authentication:** User authentication is required to ensure secure access to this endpoint. An attempt to access without a valid authentication session or token will be rejected.

**Permissions:** The user must have administrative rights or specific permission to modify class enrollments, especially in the context of managing academic portfolios.

The flow of processing in this handler starts by receiving the student's unique identifier and the associated class ID. The \`removeStudentFromClass\` method within the \`ClassService\` is then invoked, where database operations are performed to detach the student from the respective class. These operations include checking that the class exists and that the student is currently enrolled in it. Upon successful removal, the service updates the class enrollment records. Error handling is incorporated to address scenarios such as non-existent classes, non-enrolled students, or database access issues, ensuring that the response accurately reflects the outcome of the operation.`,
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
