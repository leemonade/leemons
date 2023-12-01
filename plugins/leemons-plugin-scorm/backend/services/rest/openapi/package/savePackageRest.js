const { schema } = require('./schemas/response/savePackageRest');
const { schema: xRequest } = require('./schemas/request/savePackageRest');

const openapi = {
  summary: 'Save a new SCORM package',
  description: `This endpoint allows for the uploading and saving of a new SCORM (Sharable Content Object Reference Model) package into the system. The package will be processed and stored, making it available for course content or learning management activities.

**Authentication:** User authentication is required to ensure that the user has the necessary permissions to upload and manage SCORM packages.

**Permissions:** Users need to have the appropriate 'manage_scorm_packages' permission to upload and save SCORM packages. Without this permission, the request will be rejected.

Upon receiving a request, the \`savePackageRest\` handler in the \`package.rest.js\` service will invoke the \`savePackage\` method from the \`package\` core index. This method takes the SCORM package data from the request, validates it against predefined rules set in the \`forms.js\` file, and then proceeds to store the package using a defined process that could include extracting the package contents and storing them in the appropriate file system structure or database. Once the process is completed successfully, a response indicating the status of the save operation, along with any relevant package information, is sent back to the user.`,
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
