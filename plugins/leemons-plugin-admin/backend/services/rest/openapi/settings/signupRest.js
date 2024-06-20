const { schema } = require('./schemas/response/signupRest');
const { schema: xRequest } = require('./schemas/request/signupRest');

const openapi = {
  summary: 'Registers a new administrator account',
  description: `This endpoint facilitates the registration of a new administrator account in the system. It handles the creation and storage of administrator credentials and associated roles in the database.

**Authentication:** The endpoint requires the initiating user to be logged in, usually with higher privileges such as a superadmin role.

**Permissions:** The endpoint demands that the user has the 'admin-create' permission to allow the creation of new administrator accounts.

The flow begins with the \`registerAdmin\` method from the \`settings\` core being called. This function receives necessary input parameters such as username, password, and assigned roles, encapsulating them in a security context. It validates the provided data against predefined schema and requirements, then proceeds to check for any potential duplication of username in the database. Upon successful validation, the method executes an insert operation into the database to store the new administrator's data. Post registration, a confirmation is logged, and a success response is returned to the invoking client, indicating that the administrator has been successfully registered.`,
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
