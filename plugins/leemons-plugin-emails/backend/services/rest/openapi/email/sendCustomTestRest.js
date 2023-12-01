const { schema } = require('./schemas/response/sendCustomTestRest');
const { schema: xRequest } = require('./schemas/request/sendCustomTestRest');

const openapi = {
  summary: 'Send a custom test email',
  description: `This endpoint allows users to send a test email with custom configurations. The process involves accepting email parameters and sending a test message to a specified address to confirm the configuration and delivery status.

**Authentication:** Users must be authenticated in order to send test emails. An authentication failure will result in the inability to use the endpoint.

**Permissions:** Sending test emails requires users to have appropriate permissions to access the email service. Without sufficient permissions, the request will be rejected.

Upon calling this endpoint, it firstly verifies the authentication of the user. If authentication succeeds, it then checks for the required permissions for sending emails. After validation, it proceeds to the 'sendCustomTest' method implementation, which accepts multiple email parameters, such as recipient address, subject, and email body. Inside this method, it constructs the email based on the given parameters and interfaces with the underlying email service provider to dispatch the test email. Once the email is successfully sent, or if it fails to send, the endpoint responds accordingly with a success message or an error detailing any issues encountered during the process.`,
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
