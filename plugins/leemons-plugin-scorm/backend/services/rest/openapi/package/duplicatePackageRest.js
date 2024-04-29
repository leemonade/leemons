const { schema } = require('./schemas/response/duplicatePackageRest');
const { schema: xRequest } = require('./schemas/request/duplicatePackageRest');

const openapi = {
  summary: 'Duplicate a specific SCORM package',
  description: `This endpoint duplicates a specified SCORM package within the Leemonade platform, making a complete copy of the package while preserving the original's content and settings.

**Authentication:** Users must be authenticated to perform duplication operations on SCORM packages. Without proper authentication, the request will be denied.

**Permissions:** Users need to have specific rights to duplicate SCORM packages. Typically, this would include permissions such as 'manage_package' or 'duplicate_package' within their role capabilities.

The duplication process begins by calling the \`duplicatePackage\` function defined in the 'duplicatePackage.js' file. This function is responsible for taking the original package's data, copying its entire structure, and files, and then saving it as a new entity in the database. The process ensures that all linked assets and dependencies are thoroughly cloned. As the final action, this newly created package instance is returned in the response, concluding the duplication venture.`,
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
