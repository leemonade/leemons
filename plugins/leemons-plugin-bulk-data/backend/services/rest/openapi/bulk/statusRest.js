const { schema } = require('./schemas/response/statusRest');
const { schema: xRequest } = require('./schemas/request/statusRest');

const openapi = {
  summary: 'Check bulk data processing status',
  description: `This endpoint checks the current status of a bulk data processing task. It allows users to monitor the progress of data uploads or other asynchronous bulk operations they have initiated.

**Authentication:** User authentication is required to track the progress of their own bulk data processing tasks. If unauthenticated, the endpoint will restrict access.

**Permissions:** This endpoint requires users to have 'bulk_data_view' permission to check the status of bulk data processing tasks. Access without the appropriate permissions will result in a denial of service.

Upon receiving a request, the endpoint uses the \`checkStatus\` method in the BulkDataService. This method queries the database to retrieve the current status and details of the requested bulk data processing task. The query filters tasks based on the user's session information to ensure that users can only access data related to their tasks. The response includes detailed information about the task's progression, such as the percentage completed, any errors encountered, and the expected time of completion. The output is formatted as a JSON object and returned to the user, providing a clear and informative status update.`,
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
