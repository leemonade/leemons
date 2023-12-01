const { schema } = require('./schemas/response/savePlatformEmailRest');
const { schema: xRequest } = require('./schemas/request/savePlatformEmailRest');

const openapi = {
  summary: 'Saves platform email configuration',
  description: `This endpoint is responsible for persisting email configuration settings for the platform. It assumes that updated email parameters are sent which could include SMTP settings, the default email sender information, and email template preferences, among others.

**Authentication:** This operation requires user authentication. Unauthenticated requests will not be permitted to modify email configuration settings.

**Permissions:** This endpoint mandates that the authenticated user must have administrative privileges or a specific permission set to update email configuration. Without the necessary permissions, the request will be rejected with an appropriate error response.

Upon receiving a request, the handler executes a series of validation checks on the provided email configuration parameters to ensure conformance with expected formats and constraints. After validation, it employs a service method to update the email settings in the platform's persistent storage, which typically involves interfacing with a database or configuration files. If the update is successful, a confirmation message is returned to the client, confirming the changes made to the email system configuration. In case of an error during the process, the handler ensures appropriate error details are generated and passed back in the HTTP response.`,
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
