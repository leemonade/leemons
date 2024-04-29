const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new profile to the system',
  description: `This endpoint allows for the addition of a new user profile within the system. It is responsible for creating profile entries that can be linked to specific user roles and permissions, aiding in access management and personalization of user experiences.

**Authentication:** Users need to be authenticated to perform this action. Only users with administrative privileges can add new profiles.

**Permissions:** The required permission for this endpoint is 'profile_add'. Without this permission, users cannot execute profile creation operations.

The process begins when the \`add\` method in the \`profiles\` core is called. This method involves several steps starting from validating the input data, checking for existing profiles with similar names using the \`existName\` method, and then proceeding to create a new profile if no duplicates are found. It integrates with \`createNecessaryRolesForProfilesAccordingToCenters\` to ensure necessary roles are assigned according to the user's center affiliations. The completion of the operation returns a confirmation of the profile creation or an error message detailing any issues encountered during the process.`,
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
