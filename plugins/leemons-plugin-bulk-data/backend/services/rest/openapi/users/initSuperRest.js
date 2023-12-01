const { schema } = require('./schemas/response/initSuperRest');
const { schema: xRequest } = require('./schemas/request/initSuperRest');

const openapi = {
  summary: 'Initialize superuser account',
  description: `This endpoint initializes the superuser account based on predefined system configurations. It is typically used to set up the first administrative user with all the necessary privileges to manage the system.

**Authentication:** Authentication is not required for this endpoint as it is used for initial system setup before any accounts exist.

**Permissions:** This endpoint requires no explicit permissions as it is designed to be triggered once during the system's initial setup.

Upon invocation, the \`initSuperRest\` handler in the \`users.rest.js\` file executes a sequence of operations to establish the superuser account. It starts by checking whether a superuser already exists to prevent duplicate administrative accounts. If no superuser is found, it then proceeds to create one using the system's default configuration values. This process includes generating any essential roles and permissions that align with the superuser's capabilities within the platform. After successfully creating the superuser, the handler returns a confirmation response, indicating that the system is now ready for administrative access. Throughout this operation, various internal checks and validations ensure the integrity and security of the superuser creation process.`,
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
