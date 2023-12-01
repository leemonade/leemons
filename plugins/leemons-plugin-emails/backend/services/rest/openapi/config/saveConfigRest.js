const { schema } = require('./schemas/response/saveConfigRest');
const { schema: xRequest } = require('./schemas/request/saveConfigRest');

const openapi = {
  summary: 'Saves email configuration settings',
  description: `This endpoint is responsible for saving the email configuration settings as specified by the user or administrator. It handles the persistence of the configuration details like email server settings, authentication requirements, and service-specific parameters into the system.

**Authentication:** The user needs to be authenticated to modify email configuration settings. An attempt to access this endpoint without valid authentication will result in access being denied.

**Permissions:** Appropriate permissions are required to update email configuration settings. Users without the necessary permission to change email configurations will be prevented from accessing this endpoint.

Upon receiving a request, the \`saveConfigRest\` handler commences by validating the input data for the new email configuration settings. It then calls the \`saveConfig\` method from the \`leemons-plugin-emails/backend/core/config\` directory, which in turn updates the settings in the data store. The process involves checks and validations to ensure that only valid and properly authorized changes are committed. After successful completion, the endpoint responds back to the client with a confirmation of the saved settings or an appropriate error message detailing why the operation could not be completed.`,
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
