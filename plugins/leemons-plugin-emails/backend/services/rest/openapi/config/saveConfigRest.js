const { schema } = require('./schemas/response/saveConfigRest');
const { schema: xRequest } = require('./schemas/request/saveConfigRest');

const openapi = {
  summary: 'Saves updated configuration settings for the email plugin',
  description: `This endpoint allows for the saving of updated configuration settings specific to the email functionalities within the platform. It handles requests to update various email-related configurations which might include server details, auth tokens, and preferences among others.

**Authentication:** The user must be authenticated to modify email configuration settings. This endpoint ensures that only authenticated requests are processed for security purposes.

**Permissions:** Users require administrative privileges to update email configurations. The system checks for 'manage_emails_config' permission or equivalent administrative rights before proceeding with the update.

Upon receiving a request, the \`saveConfigRest\` handler first validates the authentication and permissions of the user using middleware functions. If validation is successful, it proceeds to call the \`saveConfig\` method from the \`Config\` core. This method is responsible for updating the configuration records in the database with the provided new settings. Detailed validation of the input data is performed to ensure compliance with expected formats and values. After the update operation, the method responds with either a success message or an error detailing why the operation failed, encapsulating this in a standard JSON response format.`,
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
