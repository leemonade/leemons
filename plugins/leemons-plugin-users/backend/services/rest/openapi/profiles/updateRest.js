const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Updates user profile details',
  description: `This endpoint allows for the updating of user profile details based on the provided profile information. The update can include changes in name, roles, and other specific profile attributes that are supported by the system.

**Authentication:** Users need to be authenticated to update a profile. The endpoint validates the provided session or authentication token to ensure the request is made by a registered and logged-in user.

**Permissions:** The executing user must have admin privileges or specific permission to update user profiles. Any attempt to update a profile without the required permissions will lead to a permission denial error.

Upon receiving the update request, the handler first verifies user authentication and checks if the logged-in user has the necessary permissions. It calls the \`existName\` method to check if the provided new profile name already exists, ensuring uniqueness of profile names in the system. The \`update\` function is then executed from 'profiles/index.js', with parameters gathered from the request body, to apply the updates in the user database. This process involves interaction with several services to correctly update all elements related to the user profile, including roles and permissions. The success or failure of the operation, along with the updated profile details, is then sent back to the user in the form of a JSON response.`,
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
