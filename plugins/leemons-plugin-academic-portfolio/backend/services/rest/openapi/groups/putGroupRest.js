const { schema } = require('./schemas/response/putGroupRest');
const { schema: xRequest } = require('./schemas/request/putGroupRest');

const openapi = {
  summary: 'Update an existing academic group',
  description: `This endpoint updates the details of an existing academic group within the portfolio management system. The process includes modifying any group attributes such as name, description, and associated permissions or members based on provided data.

**Authentication:** User must be authenticated to request an update to an academic group. Unauthenticated requests are rejected with an appropriate error message.

**Permissions:** This endpoint requires the user to have 'group_edit' permission exclusively set for the targeted academic group. Absence of such permissions results in an authorization failure response.

The endpoint first validates the incoming data against the predefined validation rules set in 'forms.js' to ensure all required fields are included and correctly formatted. It then utilizes the 'updateGroup.js' method in the \`groups\` core module which performs the actual update operation on the database. Throughout the process, it engages various checks to confirm user permissions, group existence, and manage any relational constraints. The response is generated based on the success of the update operation, either confirming the updated group details or detailing any errors encountered during the process.`,
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
