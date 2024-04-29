const { schema } = require('./schemas/response/postClassInstanceRest');
const { schema: xRequest } = require('./schemas/request/postClassInstanceRest');

const openapi = {
  summary: 'Create an instance of a class within the academic portfolio',
  description: `This endpoint handles the creation of a new class instance within the academic portfolio management system. It typically involves specifying details such as the class name, associated course, and instructor details. This creation process is integral to maintaining an up-to-date academic structure in educational or institutional settings.

**Authentication:** Users need to be authenticated to create a class instance. Only logged-in users can initiate the creation process, ensuring secure and authorized access.

**Permissions:** Creation of a class instance requires specific permissions, generally reserved for administrative or educational personnel. These permissions ensure that only authorized users can add new classes to the academic portfolio.

The endpoint initiates by processing the provided input which includes necessary details about the class through the \`addClassInstance\` method. This method validates the input against predefined criteria to ensure compliance with the academic standards and structure. After validation, it proceeds to add the new class instance to the database, handling any constraints or relations inherent in the academic model, such as linking the class to a specific course and assigning an instructor. The response from the endpoint confirms the successful creation of the class instance with relevant details or provides error messages in case of issues during the creation process.`,
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
