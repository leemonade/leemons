const { schema } = require('./schemas/response/getCredentialsRest');
const { schema: xRequest } = require('./schemas/request/getCredentialsRest');

const openapi = {
  summary: "Generates MQTT credentials for an authenticated user's session",
  description: `This endpoint is responsible for the generation of unique MQTT credentials that allow an authenticated user to establish a secure connection with an MQTT broker, specifically designed for AWS IoT services.

**Authentication:** User authentication is required to ensure that MQTT credentials are generated for the correct user session. Attempting to access this endpoint without valid authentication will result in access being denied.

**Permissions:** Specific permissions checks are in place to ensure that only users with the right level of access can obtain MQTT credentials. The exact permission requirements are determined by the organization's policy and the role of the user requesting the credentials.

Upon receiving a request, the handler first verifies the user's authentication and permission level. Assuming the user is properly authenticated and has adequate permissions, the \`createCredentialsForUserSession\` method from the socket core is called. This method interacts with AWS services to create temporary security credentials leveraging AWS STS (Security Token Service). Once the credentials are obtained, they are formatted appropriately and the \`getEndpointData\` method is called to retrieve the MQTT broker endpoint information. Finally, the complete set of credentials including the broker's endpoint is returned to the user in a JSON object, enabling the client to establish a secure MQTT connection with AWS IoT.`,
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
