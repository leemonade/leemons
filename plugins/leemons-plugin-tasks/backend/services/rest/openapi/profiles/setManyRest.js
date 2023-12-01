const { schema } = require('./schemas/response/setManyRest');
const { schema: xRequest } = require('./schemas/request/setManyRest');

const openapi = {
  summary: 'Set multiple user profile configurations',
  description: `This endpoint allows for the setting of multiple user profile configurations in one operation. It is designed to handle bulk updates to user preferences, settings, or any other profile-related information the system needs to store and manage.

**Authentication:** Users must be logged in to update profile configurations. The endpoint requires valid authentication credentials, which must be provided in the request header.

**Permissions:** Users need to have the 'update_profiles' permission to execute this endpoint. Without the appropriate permission, the request will not be processed and an error will be returned.

Upon receiving a request, the handler first validates the user's authentication and permissions to ensure they have the right to update profiles. It then calls the 'setMany' method from the 'profiles' core, passing in the list of profile configurations provided in the request body. Each configuration is processed and updated in the data store. If any configuration fails to update, the method handles the error accordingly. After all the configurations have been successfully updated, the endpoint responds with a success message and status, confirming the completion of the operation.`,
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
