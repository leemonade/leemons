const { schema } = require('./schemas/response/getConfigRest');
const { schema: xRequest } = require('./schemas/request/getConfigRest');

const openapi = {
  summary: 'Fetch AWS S3 configuration settings',
  description: `This endpoint retrieves the configuration settings for AWS S3 storage used by the leebrary plugin within the Leemons platform. It fetches details such as access keys, bucket names, and other essential configurations necessary for interacting with AWS S3 services.

**Authentication:** User authentication is required to ensure that only authorized personnel access the AWS S3 configuration. A valid authentication token must be presented, or access is denied.

**Permissions:** This endpoint requires administrative permissions. Only users with the 'admin' role or specific privileges aimed at system configuration management can access this endpoint.

Upon receiving a request, this handler first verifies user authentication and permissions. If the validation is successful, it invokes the \`getConfig\` method within the 'provider' folder. This method internally uses the AWS SDK to fetch and return the current configuration settings from AWS S3. The received configuration details are then formatted appropriately and sent back to the client in a JSON response format, detailing key-value pairs of the configuration settings.`,
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
