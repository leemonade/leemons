const { schema } = require('./schemas/response/putSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/putSubjectTypeRest');

const openapi = {
  summary: 'Update a specific subject type',
  description: `This endpoint allows for the updating of a subject type's details within the academic portfolio management context. It will enable clients to modify existing subject type attributes such as name, code, and other related properties that define a subject type in the system.

**Authentication:** This endpoint requires the user to be authenticated. Users attempting to access this endpoint without a valid session or authentication token will be unable to perform the update operation.

**Permissions:** Update access rights to the academic portfolio are mandatory for using this endpoint. The user must have the proper role or permission assigned to update a subject type, ensuring that only authorized personnel can modify educational structure elements.

Upon receiving a request at this endpoint, the \`putSubjectTypeRest\` handler commences by validating the supplied input data against predefined validation schemas using the \`forms.js\` for structure and type consistency. After validation, it calls the \`updateSubjectType\` method defined in the \`subject-type/index.js\`, which interacts with the underlying database model to apply the changes. The \`saveManagers\` is then potentially invoked if there are management-level updates involved. The whole process is transactional and ensures data integrity before sending a successful response indicating the subject type has been updated, or an error message if the operation fails.`,
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
