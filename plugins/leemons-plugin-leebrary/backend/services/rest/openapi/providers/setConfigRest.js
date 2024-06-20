const { schema } = require('./schemas/response/setConfigRest');
const { schema: xRequest } = require('./schemas/request/setConfigRest');

const openapi = {
  summary: 'Configures provider settings for the application',
  description: `This endpoint is responsible for updating or setting the configuration parameters for a specified provider within the application. It primarily handles the integration settings that are essential for the functionality of external services or APIs used by the application.

**Authentication:** User authentication is mandatory to ensure that only authorized personnel can alter provider configurations. An absence of valid session or authentication tokens results in access denial.

**Permissions:** Appropriate permissions must be verified before a user can execute this operation. Typically, administrative or high-level management permissions are required to access and modify provider settings.

Upon receiving a request, the endpoint first validates the user's authentication and authorization levels. If validation is successful, it proceeds to fetch the necessary data from the request body. The \`setProviderConfig\` method from the \`Settings\` service is then called with this data, updating or establishing the configuration for the chosen provider. The flow concludes with the method either returning a success response indicating that the changes have been applied successfully or an error message detailing why the operation failed.`,
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
