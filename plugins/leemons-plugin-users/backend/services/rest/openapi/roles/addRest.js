const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new role to the system',
  description: `This endpoint enables the addition of a new role with specified permissions to the system. The role encapsulates a set of permissions that can be assigned to user-groups or individual users to manage access control within the service.

**Authentication:** It’s required that users are authenticated to use this endpoint. Only requests containing a valid authentication token will be accepted and processed.

**Permissions:** Users must have 'roles.create' permission to add new roles to the system. An authorization check is performed to ensure the user has the necessary rights to create roles.

Upon receiving a request, the endpoint initially validates the input data against predefined schemas to ensure correctness. It then proceeds to check if the role name already exists using the \`existByName\` method to avoid duplicates. If the validation passes, the \`add\` method from the \`Roles\` core is invoked to create the new role record in the database. The method expects role details such as name and associated permissions. After the role is successfully created, the function returns a confirmation with the newly created role's details.`,
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
