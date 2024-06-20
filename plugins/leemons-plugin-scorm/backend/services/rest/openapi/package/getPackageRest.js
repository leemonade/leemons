const { schema } = require('./schemas/response/getPackageRest');
const { schema: xRequest } = require('./schemas/request/getPackageRest');

const openapi = {
  summary: 'Fetches a specific SCORM package details',
  description: `This endpoint retrieves detailed information about a specific SCORM package stored within the system. It focuses on providing comprehensive package data such as metadata, content structure, and user progress if applicable.

**Authentication:** User authentication is required to access this endpoint. Users need to provide valid credentials to ensure they are authorized to access the package information.

**Permissions:** Users must have the 'view_package' permission to retrieve SCORM package details. Without this permission, the endpoint will deny access.

The process begins with the handler in \`package.rest.js\` calling the \`getPackage\` action from the \`Package\` core. This action utilizes parameters sent through the request to identify and retrieve the specific SCORM package from the database. The method leverages several sub-methods to compile the necessary details about the package, ensuring that all relevant information such as version history, content files, and user-specific interactions (if any) are included. Finally, the compiled package data is returned to the user via a structured JSON response, encapsulating all aspects of the SCORM package.`,
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
