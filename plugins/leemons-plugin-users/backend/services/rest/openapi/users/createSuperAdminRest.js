const { schema } = require('./schemas/response/createSuperAdminRest');
const { schema: xRequest } = require('./schemas/request/createSuperAdminRest');

const openapi = {
  summary: 'Create the initial super admin user',
  description: `This endpoint creates the initial super admin user account for the platform. It sets up the fundamental permissions and roles required to administer the entire system. In execution, this is typically a one-time operation carried out during the initial setup phase of the platform to ensure that there is a user with the highest level of access to manage the system and set up other user accounts and their permissions.

**Authentication:** No authentication is required to access this endpoint since it is intended to be used as part of the initial platform setup before any users are created.

**Permissions:** This endpoint does not require any permissions to be provided as it is designed to bootstrap the first super admin user who will subsequently establish the permissions for all other users.

On invocation, the \`createSuperAdminRest\` handler engages a series of core methods to establish the super admin account. Initially, it calls \`addFirstSuperAdminUser\` from the \`users\` core, which triggers the user creation pipeline, checking for uniqueness of credentials and adherence to any specified password and username policies. After ensuring input validation, it resorts to the \`bcrypt\` core module to encrypt the password, then proceeds to embed the necessary super admin privileges into the user's profile. Upon successful creation, a JWT token is generated for the new super admin user, and a welcome email is dispatched to the provided email address. This user is now equipped to log in and perform the initial configuration of the platform.`,
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
