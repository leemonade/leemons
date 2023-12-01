const { schema } = require('./schemas/response/sharePackageRest');
const { schema: xRequest } = require('./schemas/request/sharePackageRest');

const openapi = {
  summary: 'Share SCORM package with specified users or groups',
  description: `This endpoint is responsible for sharing a SCORM (Sharable Content Object Reference Model) package with a selected list of users or groups within the Leemons SaaS platform. The sharing action allows these users or groups to access and interact with the SCORM content as per the defined sharing settings.

**Authentication:** Users need to be authenticated and possess valid session credentials to use this endpoint. Only authenticated users can share SCORM packages.

**Permissions:** The user must have the 'share_scorm_package' permission assigned to their role. Without this permission, the endpoint will deny access to the sharing functionality.

Upon receiving a request to this endpoint, the \`sharePackageRest\` action initiates by validating the user's authentication token and ensuring that they have the necessary permissions to share the package. It then proceeds to call the \`sharePackage\` method from the \`package\` core, which processes the sharing instructions. This involves updating database entries to associate the SCORM package with the users or groups specified in the request. Upon successful completion, the method returns a confirmation message indicating that the package has been shared accordingly, which is then sent back to the requester as a JSON response.`,
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
