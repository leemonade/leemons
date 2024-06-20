const { schema } = require('./schemas/response/providersRest');
const { schema: xRequest } = require('./schemas/request/providersRest');

const openapi = {
  summary: 'Manage email configurations and send emails',
  description: `This endpoint is responsible for handling email-related operations, including configuring email settings and dispatching emails to specified recipients. The operations may vary from setting up email preferences to actual delivery of messages depending on the actions triggered.

**Authentication:** Users need to be authenticated to interact with the email services. The system ensures that only logged-in users can configure settings or send emails, protecting against unauthorized access.

**Permissions:** This endpoint requires the user to have ‘email_management’ permission to configure settings and ‘send_email’ permission to dispatch emails. The permissions ensure that only users with adequate rights can perform these sensitive operations.

The flow begins when the email service receives a configuration or send request. It invokes the appropriate method in the ‘EmailService’ core, which might involve reading from or writing to the email configuration database, or calling an external email service API for dispatching emails. Throughout this process, various checks are performed to ensure that the user has the necessary authentication and permissions. Errors are handled gracefully, and success or failure responses are duly returned in a comprehensible format, keeping the client-side apprised of the operation status.`,
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
