const { schema } = require('./schemas/response/getPackageRest');
const { schema: xRequest } = require('./schemas/request/getPackageRest');

const openapi = {
  summary: 'Fetch SCORM package details',
  description: `This endpoint fetches the complete details of a SCORM package, providing essential metadata and structure information about the SCORM content to the requested client.

**Authentication:** User authentication is required to ensure secure access to SCORM package details. An impeccable authentication check verifies the user's identity before granting access to the endpoint.

**Permissions:** Appropriate permissions are essential, and the user must be granted \`view_scorm_package\` permission to retrieve the details of the SCORM package. The permissions are validated during the request lifecycle to ensure strict adherence to access control.

This endpoint orchestrates a series of method invocations to fulfill the request. Initially, it invokes the \`getPackage\` method from the \`package\` core module, where it passes the necessary parameters, including the package ID from the request context. The method interacts with the underlying SCORM package management system to retrieve the package details. Subsequently, the system performs data transformation and formatting to structure the response appropriately. The processed information about the SCORM package is then returned in a structured JSON format, which encapsulates metadata, resources, and organizational details pertinent to the client's request.`,
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
