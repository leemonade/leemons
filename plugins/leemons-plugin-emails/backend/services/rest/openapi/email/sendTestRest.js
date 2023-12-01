const { schema } = require('./schemas/response/sendTestRest');
const { schema: xRequest } = require('./schemas/request/sendTestRest');

const openapi = {
  summary: 'Send a test email message',
  description: `This endpoint sends a test email message using the configured email service in the platform. It is typically used to verify that the email settings are correctly set up and that the email service is operational.

**Authentication:** Users must be authenticated to send a test email. An invalid or missing authentication token will prevent the email from being sent.

**Permissions:** Users need to have the 'send_test_email' permission to trigger the sending of a test email message.

Upon receiving a request, the handler first checks for user authentication and permissions. If the checks pass, it calls the 'sendTestEmail' method of the email service. This method is responsible for composing the test message, connecting to the email server, and dispatching the email. It utilizes the platform's underlying email library/module to interact with the SMTP server or email API. Once the email is sent, or if an error occurs during the process, the appropriate response is returned to the user indicating success or detailing any errors encountered.`,
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
