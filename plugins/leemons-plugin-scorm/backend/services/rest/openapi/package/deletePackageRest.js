const { schema } = require('./schemas/response/deletePackageRest');
const { schema: xRequest } = require('./schemas/request/deletePackageRest');

const openapi = {
  summary: 'Delete a SCORM package',
  description: `This endpoint allows for the deletion of a SCORM (Sharable Content Object Reference Model) package from the system. By calling this endpoint, the specified SCORM package will be permanently removed from the platform's storage and database.

**Authentication:** Users need to be authenticated to delete a SCORM package. It is important to ensure that the action is performed by a user with the correct privileges and authentication credentials.

**Permissions:** A user must have the appropriate permissions to delete a SCORM package. This typically means that the user needs to have administrative rights or specific rights to manage SCORM content within the platform.

Upon receiving a deletion request, the \`deletePackageRest\` action in the \`package.rest.js\` file starts by validating the provided package identifier to ensure it corresponds to an existing SCORM package. If validation passes, the action proceeds to call the \`deletePackage\` function located in the \`deletePackage.js\` file within the core package. This function is responsible for performing the actual deletion of the package both from the storage (file system or cloud storage) and from the database to ensure the package is completely eradicated. After successful deletion, a confirmation response is returned to the client.`,
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
