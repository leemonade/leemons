const { schema } = require('./schemas/response/getPlatformEmailRest');
const { schema: xRequest } = require('./schemas/request/getPlatformEmailRest');

const openapi = {
  summary: "Fetches platform's default email configuration",
  description: `This endpoint retrieves the platform's default email configuration which includes SMTP setup and default email sender details.

**Authentication:** To ensure the security of platform email settings, users need to be authenticated before accessing this endpoint. Any request without proper authentication will be rejected.

**Permissions:** Users must have administrative privileges to access the platform's email configuration. Without the appropriate level of permissions, users will not be able to retrieve the email settings.

The process begins by authenticating the user and confirming that they have the necessary administrative permissions. Upon successfully passing the authentication and authorization checks, the \`getPlatformEmailRest\` handler calls the internal service method 'getPlatformEmail' which queries the platform's database for the email configuration. This configuration includes SMTP server information and the platform's default email address used in communications. The service then forms a response with these details and returns it to the user in a structured JSON format. The email settings are critical for the platform's ability to communicate with users, making this endpoint vital for administrative management of email-related functions.`,
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
