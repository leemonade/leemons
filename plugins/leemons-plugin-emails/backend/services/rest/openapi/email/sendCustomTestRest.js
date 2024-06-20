const { schema } = require('./schemas/response/sendCustomTestRest');
const { schema: xRequest } = require('./schemas/request/sendCustomTestRest');

const openapi = {
  summary: 'Send customized test email to specified recipient',
  description: `This endpoint allows sending a customized test email based on predefined templates and user-input variables. The primary use is for testing and validating email setup within the application configuration.

**Authentication:** User authentication is mandatory to ensure secure access to email sending capabilities. Only authenticated users can invoke this functionality.

**Permissions:** The user needs to have 'email_send_test' permissions to execute this action, ensuring that only privileged users can perform testing of the email system.

Upon receiving the request, the \`sendCustomTestRest\` handler extracts necessary details such as recipient address, email template, and variable data from the request payload. It uses the \`sendEmail\` method from the \`EmailService\`, taking care to replace placeholders in the template with actual values provided in the variables payload. The entire process is managed asynchronously to handle potential high load and to provide faster system response. The outcome of the email sending operation—either successful sending or an error message—is then prepared as a JSON response to the original HTTP request.`,
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
