const { schema } = require('./schemas/response/initSuperRest');
const { schema: xRequest } = require('./schemas/request/initSuperRest');

const openapi = {
  summary: 'Initialize superuser capabilities for specified users',
  description: `This endpoint facilitates the initialization of superuser capabilities for selected users within the Leemonade platform specifically within the context of bulk user operations. This is typically used in cases where advanced level permissions need to be assigned programmatically to users who are managing various operational aspects.

**Authentication:** User authentication is mandatory to verify the legitimacy and authorization of the requester. Unauthenticated access requests will be denied, ensuring secure operations within the platform.

**Permissions:** The execution of this endpoint requires administrative privileges. Only users who possess such elevated permissions can initiate superuser status assignments, maintaining strict control over powerful platform capabilities.

The endpoint processes requests by first determining if the \`ctx\` (context) contains a valid authenticated user session. If the session is valid, it checks if the user has administrative permissions. If both conditions are satisfied, the \`initSuperRest\` action within \`users.rest.js\` interacts with the underlying user management systems to assign superuser rights. It uses specific methods to update user statuses in the database, ensuring that the changes adhere to security and operational protocols of the Leemonade platform. After successful updates, it returns confirmation of superuser status initialization to the requester.`,
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
