const { schema } = require('./schemas/response/putClassManyRest');
const { schema: xRequest } = require('./schemas/request/putClassManyRest');

const openapi = {
  summary: 'Bulk updates multiple class entities',
  description: `This endpoint applies updates to multiple class entities at once based on the provided data changes. It is typically used to synchronize classes information in bulk operation, such as updating status, adding details across several classes, or making batch adjustment to class metadata.

**Authentication:** Users need to be authenticated to perform bulk updates on classes. Unauthorized access attempts will be rejected.

**Permissions:** The endpoint requires the user to have permissions that allow the modification of class entities. Without sufficient permissions, the operation will not be executed, and an error will be returned.

Upon receiving a request with the changes to apply, the handler starts by determining the scope of classes to be updated using identifying criteria provided in the request. It then proceeds to call the \`updateClassMany\` method, passing in the necessary parameters extracted from the request body. This method interacts with the database to execute the updates on the selected class entities. The results of the operation, including any affected document identifiers or statuses of the update, are then formatted into a response and delivered back to the client as a confirmatory message detailing the outcome of the bulk update process.`,
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
