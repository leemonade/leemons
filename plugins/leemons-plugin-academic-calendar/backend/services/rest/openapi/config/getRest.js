const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Manage academic calendar configurations',
  description: `This endpoint is responsible for the management of academic calendar configurations within the platform. It allows for creation, retrieval, updating and deletion of various configuration settings related to academic periods, courses, and associated calendar events.

**Authentication:** Users need to be logged in to interact with the academic calendar configurations. A valid session is a prerequisite to authenticate the user requests to this endpoint.

**Permissions:** Users must have the 'academic-calendar:manage' permission to perform management operations on academic calendar configurations. Without the appropriate permissions, the user will not be able to carry out any actions through this endpoint.

Upon a request being made to this endpoint, the 'getRest' controller handler is invoked, which delegates to various methods depending on the action required. These methods are encapsulated within the 'Config' core module. For instance, if a request aims to fetch current configuration, the 'getConfig' method from the 'Config' module is used, extracting necessary parameters from the request context and executing a query to retrieve the settings from the persistent data store. In the case of an update operation, the handler would call a specific method designed to validate and persist the new configuration values. Throughout the process, the handler ensures proper authentication, permission checks, and adherence to the business logic defined for managing academic calendar settings. The outcome, whether it's a success message, updated configuration data, or an error message, is then formatted into a response body and sent back to the client.`,
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
