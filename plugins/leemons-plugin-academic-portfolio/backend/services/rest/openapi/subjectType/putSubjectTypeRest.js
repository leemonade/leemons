const { schema } = require('./schemas/response/putSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/putSubjectTypeRest');

const openapi = {
  summary: 'Updates a subject type',
  description: `This endpoint is responsible for updating the details of an existing subject type in the academic portfolio system. It allows modifications to attributes like name, description, or any other subject type-specific details as defined in the system.

**Authentication:** Users must be authenticated to update subject types. Access without proper authentication will prevent the request from proceeding.

**Permissions:** Usage of this endpoint requires administrative permissions related to academic management or specific permissions granted to manage and edit subject types.

The process starts in the \`putSubjectTypeRest\` handler which gathers the input data, primarily consisting of changes to be applied to an existing subject type. This data is then passed to a service method named \`updateSubjectType\`, located in the \`subject-type\` core module. This method handles the detailed logic to verify existing data, apply the updates, and save the changes in the database. It ensures that all updates adhere to predefined schemas and business rules, returning the updated subject data or an error message if the update fails.`,
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
