const { schema } = require('./schemas/response/statusRest');
const { schema: xRequest } = require('./schemas/request/statusRest');

const openapi = {
  summary: 'Monitor bulk operation status',
  description: `This endpoint is designated for monitoring the status of bulk data operations. It allows clients to track the progress or completion of tasks such as importing or exporting large datasets.

**Authentication:** User authentication is mandatory for accessing the status of bulk data operations. Unauthenticated requests will be rejected.

**Permissions:** Specific permissions are enforced for users to access this endpoint. Users must have appropriate rights to engage with bulk data tasks and inquire about their statuses.

Upon receiving a request, the \`statusRest\` handler method initiates a process to check the current status of a bulk operation. It calls the \`checkStatus\` service method with necessary parameters such as the operation ID. The service method interacts with underlying systems to fetch the status of the operation which could range from 'pending', 'in progress', to 'completed'. Once the status is retrieved, it constructs a response encapsulating the status details and responds to the client query with a complete status report, including any potential error messages or results, in a structured JSON format.`,
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
