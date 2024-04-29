const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specific educational period',
  description: `This endpoint facilitates the deletion of an educational period from the system database. It is primarily used to manage lifecycle of periods ensuring that obsolete or mistaken entries can be cleaned up efficiently from the platform.

**Authentication:** Users must be authenticated to perform this action. An invalid or missing authentication token will result in access being denied to this endpoint.

**Permissions:** Adequate permissions are required to delete periods. Typically, this would necessitate administrative rights or specific role-based permissions that allow manipulation of period-related data.

Upon receiving a request, this handler invokes the \`removePeriod\` method defined in the \`periods/removePeriod.js\` backend core file. The method uses the period's unique identifier, typically passed through the request parameters, to locate and remove the period from the database. The operation might involve validation checks such as confirming the existence of the period and ensuring that the requesting user has appropriate rights to delete it. Once the deletion is successful, confirmation of the action is sent back to the user, generally in the form of a simple success message or status code indicating that the period has been successfully removed.`,
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
