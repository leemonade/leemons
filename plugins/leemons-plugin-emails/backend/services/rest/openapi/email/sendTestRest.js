const { schema } = require('./schemas/response/sendTestRest');
const { schema: xRequest } = require('./schemas/request/sendTestRest');

const openapi = {
  summary: 'Send a test email to verify SMTP settings',
  description: `This endpoint allows administrators to send a test email to verify the configuration and functionality of the SMTP settings in the system. This is critical for ensuring that the email communication services are operational and emails can be reliably sent from the platform.

**Authentication:** User authentication is required to access this endpoint. Users must provide valid credentials to initiate the email sending process.

**Permissions:** This endpoint requires administrator privileges. A user must have the 'admin' role or specific email management permissions in order to execute this test.

The \`sendTestEmail\` method is invoked when a request reaches this endpoint. It utilizes configured SMTP settings to send an email to a predefined recipient address. The method initiates a connection to the SMTP server, constructs the email based on parameters (like sender, recipient, subject, and body) provided in the request or predefined defaults, and sends the email. If the email is successfully sent, the server returns a success message; otherwise, it handles errors by capturing them and providing appropriate feedback to the user. This complete process ensures that any issues with email delivery can be identified and corrected promptly.`,
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
