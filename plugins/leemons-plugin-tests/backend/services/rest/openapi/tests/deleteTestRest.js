const { schema } = require('./schemas/response/deleteTestRest');
const { schema: xRequest } = require('./schemas/request/deleteTestRest');

const openapi = {
  summary: 'Delete a specific test',
  description: `This endpoint is responsible for deleting a test from the system. It handles the removal of test data, ensuring that all related entities are also deleted or updated accordingly to maintain data integrity across the platform.

**Authentication:** Users need to be authenticated to perform deletion operations. An attempt to delete a test without proper authentication will be rejected.

**Permissions:** Adequate permissions are required to delete a test. Users must have 'delete' permissions on the test entity to carry out this operation. Lack of the necessary permissions will result in access being denied.

Upon receiving a delete request, the handler invokes a service method that starts a transaction to ensure atomicity throughout the deletion process. It then proceeds to call different internal methods and hooks that are responsible for the cascading deletion of records associated with the test, including any questions, answers, and results. Error handling is integral to the process, capturing any exceptions that occur and rolling back the transaction to maintain consistency if needed. The response to the client signifies the success or failure of the deletion operation with corresponding HTTP status codes and messages.`,
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
