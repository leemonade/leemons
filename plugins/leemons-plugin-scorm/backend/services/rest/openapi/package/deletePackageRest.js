const { schema } = require('./schemas/response/deletePackageRest');
const { schema: xRequest } = require('./schemas/request/deletePackageRest');

const openapi = {
  summary: 'Delete a specific SCORM package',
  description: `This endpoint allows for the deletion of a specific SCORM package from the system. The operation effectively removes the specified package and all related data, ensuring that it is no longer accessible within the platform.

**Authentication:** Users need to be authenticated to initiate deletion of a SCORM package. Any attempt to access this endpoint without valid authentication credentials will result in access being denied.

**Permissions:** This endpoint requires the user to have administrative rights or specific permissions to delete SCORM packages. Users without the necessary permissions will be prevented from performing this operation.

Upon receiving a delete request, the endpoint first verifies the authentication and permission of the requesting user. It then proceeds to call the \`deletePackage\` method from the \`package\` core module. This method handles the business logic for finding and removing the SCORM package from the database. If the specified package is successfully located and deleted, a confirmation is sent back to the user. The process ensures that all traces of the SCORM package are removed securely and efficiently, confirming the successful deletion to the client via an HTTP response.`,
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
