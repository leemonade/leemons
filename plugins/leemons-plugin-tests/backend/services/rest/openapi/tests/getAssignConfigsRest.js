const { schema } = require('./schemas/response/getAssignConfigsRest');
const { schema: xRequest } = require('./schemas/request/getAssignConfigsRest');

const openapi = {
  summary: 'Assigns saved configurations to a user or entity',
  description: `This endpoint is responsible for associating saved configurations with a specific user or entity based on provided criteria. The functionality ensures that personalized settings or preferences are retained and applied as needed across different sessions or interactions.

**Authentication:** User authentication is mandatory to ensure that the assignment of configurations is secure and specific to an authorized user. Unauthorized access or unauthenticated requests are systematically rejected.

**Permissions:** The user must have the appropriate permissions to modify or assign configurations. This typically includes administrative rights or specific role-based permissions that allow for configuration management.

The handler begins by extracting necessary parameters from the request, such as user or entity identifiers and the specific configuration details to be applied. It then invokes a method from the configuration management service to validate the existence and appropriateness of the configurations for assignment. Following validation, the configurations are applied to the intended user or entity. The process involves database transactions to ensure that the changes are persistently stored and retrievable in future sessions. Once successfully applied, the service constructs and sends a response back to the client, confirming the successful assignment of the configurations.`,
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
