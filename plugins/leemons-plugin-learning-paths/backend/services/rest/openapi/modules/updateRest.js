const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update an existing learning module',
  description: `This endpoint allows for updating the details of an existing learning module within the system. The update could include changes to the module's content, structure, and associated metadata. The process ensures that the module remains consistent and up-to-date with the latest information or pedagogical adjustments.

**Authentication:** Users must be authenticated to perform updates on learning modules. The request must include a valid authentication token to proceed with the update operation.

**Permissions:** Users need the appropriate permission to update a learning module. The specific permission required is defined within the learning path's plugin and ensures that only authorized personnel can make changes to the module's content or structure.

The \`updateRest\` handler starts by validating the incoming request for necessary parameters and ensuring that the request complies with the expected schema. It then calls the \`updateModule\` function from the \`modules\` core, passing in the module's identifier and the new data for the update. The \`updateModule\` function interacts with the database to apply the changes, handling any constraints or relationships that need to be maintained. Once the operation is successful, the handler returns a confirmation message along with the updated module's details, sending back an HTTP response with a status code indicating the success of the operation.`,
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
