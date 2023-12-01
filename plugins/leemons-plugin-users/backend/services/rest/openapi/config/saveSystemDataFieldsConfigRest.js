const { schema } = require('./schemas/response/saveSystemDataFieldsConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/saveSystemDataFieldsConfigRest');

const openapi = {
  summary: 'Save system data fields configuration',
  description: `This endpoint allows for the updating of the system's data fields configuration. It is intended to modify how certain data fields are managed and stored within the system, which may affect various functionalities and user interfaces.

**Authentication:** The user must be authenticated to perform this operation. Unauthenticated requests will be rejected.

**Permissions:** The user requires specific administrative permissions to update system data fields configuration. Without the requisite permissions, the user will be denied access to this endpoint.

Upon receiving a request to save a new configuration, the \`saveSystemDataFieldsConfigRest\` handler first validates the input data using the appropriate schema validation. It then calls the \`saveSystemDataFieldsConfig\` method from the \`config\` core, which handles the business logic for updating the system's data fields configuration. This method will interact with the system's database or configuration files to persist the changes. If successful, the endpoint responds with a confirmation message indicating that the configuration has been updated. If any errors occur during processing, an error message is returned detailing the issue.`,
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
