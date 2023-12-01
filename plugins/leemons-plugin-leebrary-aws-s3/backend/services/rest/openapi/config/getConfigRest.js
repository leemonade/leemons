const { schema } = require('./schemas/response/getConfigRest');
const { schema: xRequest } = require('./schemas/request/getConfigRest');

const openapi = {
  summary: 'Fetch AWS S3 configuration for the current user',
  description: `This endpoint retrieves the AWS S3 configuration data specific to the currently authenticated user. It provides the necessary information for client-side applications to interact with the AWS S3 service, including access keys and bucket details.

**Authentication:** Users must be authenticated to retrieve their AWS S3 configuration. Without proper authentication credentials, the endpoint will reject the request.

**Permissions:** The user needs to have adequate permissions to view or manage AWS S3 configurations. Typically, this would require administrative privileges or specific roles that grant access to AWS S3 resource configurations.

Upon receiving a request, the \`getConfigRest\` handler first validates the user's authentication and permissions. If the user is authorized, it proceeds to invoke the \`getConfig\` method from the \`provider\` core. This method is responsible for fetching the user-specific AWS S3 configuration from the system's configuration store or database. After successful retrieval, the method returns the configuration data in a structured format, which is then sent back to the user in the HTTP response as a JSON object.`,
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
