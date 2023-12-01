const { schema } = require('./schemas/response/getDatasetFormRest');
const { schema: xRequest } = require('./schemas/request/getDatasetFormRest');

const openapi = {
  summary: 'Retrieves dataset form configurations',
  description: `This endpoint retrieves the configuration for a dataset form associated with families within the platform. It provides the necessary structure and fields that compose the form to capture family-related data.

**Authentication:** User authentication is required to ensure secure access to family dataset forms. Unauthenticated requests are rejected.

**Permissions:** Appropriate permissions must be granted for a user to access family dataset forms. These permissions ensure that only authorized personnel can retrieve and manage family data within the platform.

Upon receiving a request, the endpoint first validates the user's authentication status and permissions to ensure that they are allowed to access the form configurations. If validation is successful, it proceeds to call the 'getDatasetForm' method, which queries the system's database or configuration files to retrieve the specified dataset form for families. The method considers the context of the request, including any applicable organization or user roles, to provide a tailored form structure. Once retrieved, the configuration is formatted and sent back to the client as a JSON object, containing the details necessary to render the form on the client side.`,
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
