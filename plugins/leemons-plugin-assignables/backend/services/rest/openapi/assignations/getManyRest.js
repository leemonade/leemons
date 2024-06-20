const { schema } = require('./schemas/response/getManyRest');
const { schema: xRequest } = require('./schemas/request/getManyRest');

const openapi = {
  summary: 'Fetches multiple assignations based on specified criteria',
  description: `This endpoint fetches a list of assignations based on various filtering, sorting, and pagination parameters. It is intended to provide a comprehensive overview of assignations that meet specified criteria, aiding in efficient data management and retrieval within the application.

**Authentication:** Users must be authenticated to request the assignation data. Authentication tokens must be provided as part of the request headers to verify user identity and session validity.

**Permissions:** Proper permissions are required to access this endpoint. Users need to have roles or rights specifically granting them access to view assignations. Failure to meet these permission checks will result in access being denied.

Upon receiving a request, the \`getManyRest\` handler initiates a process to validate user authentication and authorization. Post validation, it employs a series of methods to apply filters, execute sorting mechanisms, and handle pagination details. The final data retrieval involves querying the database with the formulated conditions to compile a list of assignations that match the provided parameters. The result set is then formatted and delivered as a structured JSON response, providing the client with the requested data on assignations.`,
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
