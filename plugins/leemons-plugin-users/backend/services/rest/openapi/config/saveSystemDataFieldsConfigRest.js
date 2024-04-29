const { schema } = require('./schemas/response/saveSystemDataFieldsConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveSystemDataFieldsConfigRest');

const openapi = {
  summary: 'Save system data fields configuration',
  description: `This endpoint handles the update or creation of system-wide configuration data fields. These configurations control various aspects of how data fields are managed and stored across the platform.

**Authentication:** Users must be logged in to modify system data fields configuration. Authentication ensures that only authorized users can alter these settings.

**Permissions:** This endpoint requires administrator-level permissions. A user must have the 'admin' role to access and modify the system data fields configuration.

This method begins by validating the input received from the user against a predefined schema to ensure data integrity and security. Once validation is successful, the \`saveSystemDataFieldsConfig\` function from the backend's \`config\` core is called. This function takes the validated data and updates the existing system configuration if it exists, or creates a new configuration entry if it does not. The response from this operation will inform the user whether the update or creation was successful, including details of the record that was affected.`,
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
