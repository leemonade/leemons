const { schema } = require('./schemas/response/updateUserRest');
const { schema: xRequest } = require('./schemas/request/updateUserRest');

const openapi = {
  summary: 'Update user details',
  description: `This endpoint allows for the updating of an existing user's profile details based on the given input parameters. The operation will modify user attributes such as name, email, or any other user properties that the API supports. 

**Authentication:** Users need to be logged in to make updates to their profile. Authentication is enforced through the user's session token, and attempts to update a user profile without a valid token will be rejected.

**Permissions:** The user must have the appropriate permission level to update user profiles. Typically, administrative rights or elevated privileges are required to make changes to other users' profiles. In some cases, users may also have permission to update certain aspects of their own profiles.

Upon receiving the request, the \`updateUserRest\` handler first checks for user authentication and permissions. If the request is unauthorized or the permissions are insufficient, an error response is returned. With proper authentication and permissions, it calls the \`updateUser\` method from the users' core logic, passing along the parameters it received from the request body. The core method then validates the parameters and performs the necessary database operations to update the user's information. If the update is successful, the endpoint responds with a success message and the updated user's details. In the case of any errors during the process, such as validation failures or database issues, the endpoint returns an appropriate error message detailing what went wrong.`,
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
