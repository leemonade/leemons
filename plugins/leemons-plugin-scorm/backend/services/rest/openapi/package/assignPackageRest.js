const { schema } = require('./schemas/response/assignPackageRest');
const { schema: xRequest } = require('./schemas/request/assignPackageRest');

const openapi = {
  summary: 'Assign a SCORM package to a user or group',
  description: `This endpoint assigns a specific SCORM package to either a user or a group based on the parameters provided. This function is crucial for tailoring learning experiences to different users or groups within the educational platform.

**Authentication:** Users need to be authenticated to assign SCORM packages. The endpoint checks for a valid session or token before proceeding with the assignment.

**Permissions:** The user must have 'assign-package' permission to execute this action. Without the appropriate permissions, the request will be rejected, ensuring that only authorized personnel can assign learning materials.

After authentication and permission checks, the \`assignPackage\` method in \`package.core.js\` is invoked with necessary parameters like package ID and user or group ID. This method interacts with the database to update or create entries that link the SCORM package with the specified users or groups. The process involves several validation steps to ensure the package exists and the user/group IDs are valid. Upon successful assignment, the system logs the action for auditing purposes and returns a success response to the client.`,
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
