const { schema } = require('./schemas/response/postProgramRest');
const { schema: xRequest } = require('./schemas/request/postProgramRest');

const openapi = {
  summary: 'Add a new academic program to the system',
  description: `This endpoint facilitates the addition of a new academic program into the academic portfolio management system. It involves creating a detailed record that describes all aspects of an academic program, such as its structure, subjects, and related courses.

**Authentication:** User must be logged in to access this endpoint. Authentication ensures that only registered users can insert new academic programs into the system.

**Permissions:** The user must have administrative rights or be granted specific permissions related to academic management to add a program. Without the necessary permissions, the endpoint access is restricted and the operation will not be executed.

After receiving the API call, the handler initiates the \`addProgram\` method in the programs core API. This method processes input data, which includes program details such as name, description, and configuration settings. Once validated, the data is stored in the database, creating a new program. Upon successful creation, the system sends back a confirmation response including the ID of the newly created program, indicating successful operation. Throughout this process, the system ensures that all inputs are correctly formatted and that the user has the appropriate rights to perform the operation.`,
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
