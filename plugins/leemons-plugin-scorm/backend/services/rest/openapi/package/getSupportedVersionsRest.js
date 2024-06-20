const { schema } = require('./schemas/response/getSupportedVersionsRest');
const {
  schema: xRequest,
} = require('./schemas/request/getSupportedVersionsRest');

const openapi = {
  // summary: "Summary",
  description: `{
    "summary": "Lists supported SCORM versions",
    "description": "This endpoint provides a list of SCORM versions supported by the system. It is primarily used to ensure compatibility between the content packaged in a SCORM format and the platform.

**Authentication:** User authentication is required to access this endpoint. Access will be denied if the authentication credentials are not provided or are invalid.

**Permissions:** The user must have 'view' permissions on SCORM content to use this endpoint. Without adequate permissions, the request will be rejected with an appropriate error message.

The process begins when the \`getSupportedVersionsRest\` action is called, handling the request through the Moleculer framework. This action retrieves an array of supported SCORM versions from the service configuration or a similar data source. Each version in the list represents a SCORM version that is compatible with the platform. The array is then returned in the response, formatted in JSON, showing the versions that the client's content can be validated against."
}`,
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
