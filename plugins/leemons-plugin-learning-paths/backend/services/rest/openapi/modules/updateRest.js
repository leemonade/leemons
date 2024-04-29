const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Updates specific learning module details',
  description: `This endpoint allows for the modification of existing module details within the Leemons platform's Learning Paths plugin. The primary function is to update module information based on provided data, which can include changes to names, descriptions, and associated metadata of the module.

**Authentication:** User authentication is mandatory to ensure that only authorized users can update modules. A valid session or token must be provided to access this endpoint.

**Permissions:** The user must have 'module.edit' permission to update module details. Without the appropriate permissions, the endpoint will reject the request and return an authorization error.

Upon receiving the update request, the \`updateModule\` function within the \`modules\` core is triggered, which first validates the provided data against the module schema. Assuming validation passes without errors, it proceeds to update the module details in the database. The function interacts with the database using a transaction to ensure that all data is consistently updated without errors. Upon successful update, a confirmation is sent back to the client indicating the successful modification of the module, along with the updated module data.`,
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
