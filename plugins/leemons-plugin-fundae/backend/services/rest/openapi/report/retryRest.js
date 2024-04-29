const { schema } = require('./schemas/response/retryRest');
const { schema: xRequest } = require('./schemas/request/retryRest');

const openapi = {
  summary:
    'Performs retry operations on previously failed report generation tasks',
  description: `This endpoint initiates retry operations for previously failed report generation tasks. It processes the failed tasks queued in the system and attempts to regenerate the reports based on the newer parameters or fixed logic implemented after the initial failure.

**Authentication:** User authentication is required to access this endpoint. Only authenticated users with valid session tokens can initiate retry operations for report generation.

**Permissions:** Users need to have specific administrative permissions to execute retry tasks on report generation. These permissions ensure that only authorized personnel manage and execute retries for critical data processing tasks.

Upon receiving the retry request, the endpoint invokes the \`retryReportGeneration\` method from the \`ReportService\`. This method scans the queued logs for any reports that failed to generate initially. It then processes these logs to determine the cause of failure and applies fixes or updates parameters as needed. Subsequently, it attempts to regenerate the reports. The entire flow from checking the queue to processing and regenerating reports is managed within a transactional block to ensure data integrity and consistency. The outcome of each retry attempt, whether successful or failure, is logged for auditing purposes and returned in the response to provide feedback on the retry operation.`,
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
