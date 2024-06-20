const { schema } = require('./schemas/response/getCredentialsRest');
const { schema: xRequest } = require('./schemas/request/getCredentialsRest');

const openapi = {
  summary: 'Generates and retrieves MQTT credentials for a user session',
  description: `This endpoint generates and retrieves AWS IoT MQTT credentials for a user's session to securely communicate with MQTT topics. It facilitates secure messaging by integrating with AWS IoT Core for credential handling.

**Authentication:** User authentication is required to access these MQTT credentials. If authentication fails, the endpoint will not provide any credentials.

**Permissions:** The user must have permissions for MQTT communication setup in their user profile to access this endpoint. Without the necessary permissions, access to MQTT credentials will be denied.

The core workflow of the handler begins with the \`createCredentialsForUserSession\` function in the service layer, which is responsible for creating and associating the necessary AWS IoT credentials with the user's current session. This function internally calls \`getEndpointData\` to retrieve data specific to the AWS IoT endpoint, followed by \`createCredentials\` that invokes AWS services to generate the actual credentials. Once credentials are generated, they are sent back to the user in the form of a JSON object, enabling secure MQTT communication for the session.`,
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
