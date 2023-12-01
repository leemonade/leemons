const { schema } = require('./schemas/response/retryRest');
const { schema: xRequest } = require('./schemas/request/retryRest');

const openapi = {
  summary: 'Retry generating a report for Fundae',
  description: `This endpoint attempts to retry the generation of a specific report for Fundae after a previous failure. This can be necessary when the initial report generation process does not complete successfully due to processing errors or timeouts.

**Authentication:** Users must be authenticated to retry report generation. Without valid authentication, the endpoint will deny access.

**Permissions:** The user needs adequate permissions to initiate the retry operation for report generation. Lack of proper permissions will prevent the user from carrying out this action.

Upon receiving a retry request, the handler initiates the 'retryGenerateReport' method from the 'Report' core. It retrieves the necessary data required for the generation of the report from the request context and ensures all the prerequisites for report generation are met. The method employs error handling mechanisms to deal with potential issues that may arise during the report generation process. Once the report is successfully generated, it is either stored for later retrieval or sent directly to the user, according to the implementation specifics of the service. If the generation fails again, the endpoint provides appropriate feedback to the client, detailing the failure reason.`,
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
