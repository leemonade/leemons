const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update existing user role information',
  description: `This endpoint allows the updating of role information for a user within the system. Modifications can include changes to role names, descriptions, and associated permissions.

**Authentication:** Users need to be authenticated and have appropriate credentials to update role information. An authentication check is performed before proceeding with the role update process.

**Permissions:** The user must have role management permissions, specifically the ability to update roles. If the user does not possess the required permissions, the request will be rejected.

Upon receiving a request, the endpoint first validates the input data for the update, ensuring all mandatory fields are present and correctly formatted. Next, it verifies the user's permissions to ensure they are authorized to update roles. If validation and authorization checks pass, it calls the \`updateRole\` method within the \`roles\` core. This method applies the update to the database and ensures data integrity throughout the operation. Once updated, it triggers any necessary system updates or user notifications related to the role changes. The response includes a success confirmation or any encountered errors.`,
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
