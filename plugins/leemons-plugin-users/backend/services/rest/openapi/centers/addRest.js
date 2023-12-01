const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new center',
  description: `This endpoint is responsible for creating a new center within the system. It takes center details provided in the request and persists them in the database if they meet the validation criteria.

**Authentication:** Center creation requires user authentication, ensuring only authorized users can perform this operation.

**Permissions:** Users must have the 'manage_centers' permission to create a new center, indicating they have the authority to manage educational or organizational centers in the platform.

The handler process begins with a validation step to ensure the incoming data meets the required structure and content expectations. If the data is valid, the \`add\` method from the \`centers\` core is invoked to add the new center. This method checks whether a center with the provided name already exists by calling \`existName\`. If the name is unique, \`add\` proceeds to persist the new center's information in the database. The response will include details of the newly created center or an error message if the creation was unsuccessful.`,
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
