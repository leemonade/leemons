const { schema } = require('./schemas/response/setInstanceTimestampRest');
const {
  schema: xRequest,
} = require('./schemas/request/setInstanceTimestampRest');

const openapi = {
  summary:
    'Sets the current instance timestamp for a specific test configuration',
  description: `This endpoint updates the timestamp for a test instance in the test configuration database. This operation is crucial for tracking and logging purposes, specifically for identifying when certain test activities occurred.

**Authentication:** Users must be authenticated to update a test instance timestamp. Authentication ensures that only authorized personnel can make such updates to maintain test integrity.

**Permissions:** This endpoint requires administrative permissions related to test management. Users without the appropriate permissions will not be able to update timestamps.

Upon receiving a request, the \`setInstanceTimestamp\` function is invoked from the \`Tests\` service. This function retrieves the test instance details based on the provided instance identifier and proceeds to update the timestamp field with the current server time. This operation involves a transaction-like mechanism, ensuring that the timestamp update is atomic and error-free. The method concludes by returning a success status if the update is completed without any issues, otherwise, it will return an appropriate error response.`,
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
