const { schema } = require('./schemas/response/postCurriculumRest');
const { schema: xRequest } = require('./schemas/request/postCurriculumRest');

const openapi = {
  summary: 'Add a new curriculum',
  description: `This endpoint is responsible for adding a new curriculum to the database. It handles the validation of input data to ensure adherence to required curriculum structures and saves the validated curriculum details in the database.

**Authentication:** User authentication is required to access this endpoint. Without successful authentication, the endpoint will reject the request and inform the user of the need to log in.

**Permissions:** The user must have the 'add_curriculum' permission to execute this action. Users without the appropriate permissions will receive an error indicating insufficient privileges.

The flow of this endpoint begins by parsing and validating the incoming data against a pre-defined schema to ensure it meets all requirements for a curriculum entity. If the data is valid, it proceeds to invoke the \`addCurriculum\` method in the curriculum core service with the sanitized data. This method takes care of interacting with the database to store the new curriculum details. Upon successful insertion, the endpoint returns a success message and details of the added curriculum. If any part of the process fails, appropriate error messages are generated and returned to the user, providing clarity on what went wrong.`,
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
