const { schema } = require('./schemas/response/setProfilesRest');
const { schema: xRequest } = require('./schemas/request/setProfilesRest');

const openapi = {
  summary: 'Update academic profile settings',
  description: `This endpoint is responsible for updating the academic profile settings within the system. It takes the provided profile configuration and applies the changes to the user's academic portfolio.

**Authentication:** Users need to be authenticated to update their academic profile settings. The process is secured to ensure that only authorized users can make changes to their profiles.

**Permissions:** This endpoint requires the user to have administrative privileges or relevant permissions set to manage and update academic profile settings. Without the appropriate permissions, the user will not be able to modify settings.

Upon receiving a request, the \`setProfilesRest\` handler invokes the \`setProfiles\` method located in the \`setProfiles.js\` file, passing along the profile settings data submitted by the user. This method is responsible for validating the input and applying the changes to the system database. The operation involves checking for existing profiles, updating the necessary entries, and ensuring that the profile settings conform to the required structure and constraints. The process concludes with a response indicating the success or failure of the operation, along with any relevant information or error messages.`,
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
