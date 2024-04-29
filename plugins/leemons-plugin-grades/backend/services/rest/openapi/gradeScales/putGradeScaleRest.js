const { schema } = require('./schemas/response/putGradeScaleRest');
const { schema: xRequest } = require('./schemas/request/putGradeScaleRest');

const openapi = {
  summary: 'Update an existing grade scale',
  description: `This endpoint updates a specific grade scale's details based on the provided scale ID. It is designed to modify attributes like name, range, and descriptions of an existing grade item, reflecting changes across the platform where the grade scale is applied.

**Authentication:** Users need to be authenticated to execute this update operation. Access without proper authentication will restrict the user from performing the update.

**Permissions:** The user must have administrative rights or sufficient permissions related to grade management to update a grade scale. Lack of such permissions will prevent the grade scale modifications.

Upon receiving the update request, the endpoint first verifies the user's authentication and authorization. It then proceeds to invoke the \`updateGradeScale\` method from the \`grade-scales\` service. This method handles the business logic to update the grade scale's details in the database, ensuring data integrity and consistency. If the update is successful, the endpoint responds with the updated grade scale details; otherwise, it handles errors by returning an appropriate error response indicating what went wrong during the update process.`,
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
