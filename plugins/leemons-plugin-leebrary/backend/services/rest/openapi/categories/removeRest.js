const { schema } = require('./schemas/response/removeRest');
const { schema: xRequest } = require('./schemas/request/removeRest');

const openapi = {
  summary: 'Remove a specific category',
  description: `This endpoint removes a specific category from the library system. It is expected to delete the category record and any associated references from the database, ensuring data integrity within the library system.

**Authentication:** Users must be logged in to delete a category. The request will be rejected if the user is not authenticated.

**Permissions:** The user needs to have the 'category.delete' permission in their role to delete a category. Without the required permission, the endpoint will deny access.

Upon receiving a request, the controller first verifies that the user is authenticated and has the required permission to proceed with the deletion. It then calls the \`remove\` method from the \`categories\` core service, passing necessary parameters such as the category identifier. The \`remove\` method handles the logic for ensuring that the category is eligible for deletion (e.g., not being used by any asset) and then proceeds to delete it from the database. If the operation is successful, the method returns a confirmation message; otherwise, it throws an error that encapsulates the reason for failure. The response to the client will then contain either the success message or error details, accordingly.`,
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
