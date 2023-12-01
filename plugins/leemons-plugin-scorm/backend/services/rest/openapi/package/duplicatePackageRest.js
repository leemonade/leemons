const { schema } = require('./schemas/response/duplicatePackageRest');
const { schema: xRequest } = require('./schemas/request/duplicatePackageRest');

const openapi = {
  summary: 'Duplicate a SCORM package',
  description: `This endpoint duplicates a specific SCORM package. It creates an exact copy of the selected package, including all its associated content and settings, to be used as a template or for additional modifications without altering the original package.

**Authentication:** Users need to be authenticated to duplicate a SCORM package. Unauthorized access attempts will be rejected.

**Permissions:** Users must have 'duplicate_scorm_package' permission to execute this operation. Attempting to duplicate a package without the appropriate permissions will result in access being denied.

Upon receiving the request to duplicate a package, the \`duplicatePackage\` function within the \`package\` service is invoked. This function is responsible for cloning the specified package's data and ensuring that the newly created package reflects all characteristics of the original. This includes copying database records, related files, and any settings associated with the package. The flow proceeds with validation checks, including authentication and permission verification, before performing the duplication process. Once duplicated successfully, the service returns a confirmation containing the details of the new SCORM package, wrapped in a standard API response format.`,
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
