const { schema } = require('./schemas/response/postRest');
const { schema: xRequest } = require('./schemas/request/postRest');

const openapi = {
  summary: 'Update organization settings',
  description: `This endpoint updates the organization details based on the given settings. This could include updates to organization name, address, contact details, and other organizational configurations relevant for the application.

**Authentication:** It is required that users be authenticated to perform updates on the organization settings. Authentication ensures that only authorized users can make changes to sensitive organizational information.

**Permissions:** The user must have administrative rights or specific role-based permissions to update organization settings. Without sufficient permissions, the request will be rejected to maintain organizational data integrity.

The flow begins with the \`updateOrganization\` handler in the \`organization.rest.js\` service file, which utilizes the \`updateOrganization\` core function from \`updateOrganization.js\`. This function is responsible for handling the logic to update the desired organizational settings in the database. It involves validation checks to ensure data integrity and authorization logic to verify that the user has the required permissions to make changes. Upon successful validation and authorization, the organization's data is updated in the database, and a success response is generated and sent back to the user.`,
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
