const { schema } = require('./schemas/response/getSystemDataFieldsConfigRest');
const {
  schema: xRequest,
} = require('./schemas/request/getSystemDataFieldsConfigRest');

const openapi = {
  summary: 'Fetches system configuration data fields',
  description: `This endpoint retrieves the configuration data fields specifically related to the system's operation and setup. It primarily serves as a utility for the system administration by providing essential configuration details necessary for system configuration and audits.

**Authentication:** Users need to be authenticated to access this endpoint. Access without proper authentication will be denied, ensuring that only verified users can retrieve system configuration information.

**Permissions:** Users need specific administrative permissions to retrieve these system configuration data fields. The exact permissions are defined within the system's role management framework, which restricts access to sensitive information to authorized personnel only.

The controller starts by executing the \`getSystemDataFieldsConfig\` method in the system's configuration module. This method compiles an array of configuration settings that are crucial for system setup and audits, focusing on aspects like security settings, data handling policies, and other operational parameters. The controller captures and formats these details, handing them over through a structured JSON response to the authenticated and authorized user, effectively supporting informed system management decisions.`,
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
