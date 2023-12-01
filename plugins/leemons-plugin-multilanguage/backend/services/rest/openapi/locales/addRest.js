const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add or update localization information',
  description: `This endpoint allows for the addition of new localization information or the updating of existing localization data within the system. Locale data includes language-specific strings and configurations required for internationalization of the platform.

**Authentication:** Users must be authenticated to modify localization data. Access without proper authentication will be rejected.

**Permissions:** Users need to have adequate permissions to alter localization settings. Insufficient permissions will result in an inability to add or update locale data.

Upon receipt of a request, the handler initiates a series of operations to determine whether it is an addition of a new locale or an update of an existing one. It begins by validating the provided data against predefined schemas using a validation service. Following validation, it utilizes either the \`create.js\` core file to add new locale data or the \`update.js\` for updating existing locales, ensuring that validation rules are respected and data integrity is maintained. The handler responds with a success message and the modified locale data, or an error message in the case of a validation or permissions issue.`,
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
