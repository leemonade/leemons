const { schema } = require('./schemas/response/putCycleRest');
const { schema: xRequest } = require('./schemas/request/putCycleRest');

const openapi = {
  summary: 'Update a specific academic cycle information',
  description: `This endpoint allows for the updating of an academic cycle's details. It ensures that the academic structure remains current and reflective of any changes made to a cycle's configuration or status.

**Authentication:** The endpoint requires the user to be logged in to perform an update on an academic cycle's data. Without proper authentication, the request will be rejected.

**Permissions:** To access this endpoint, the user must have permissions to modify the academic cycle details. The required permission checks ensure that only authorized personnel can make changes to the cycle data.

Upon receiving a request, the \`putCycleRest\` starts by validating the input data against a structured set of criteria to ensure that it contains all necessary information and adheres to predefined formats. Once validated, it calls the \`updateCycle\` method from the \`cycle\` core with the payload data. This method interacts with the underlying database to apply the updates to the specified academic cycle. The update process takes several factors into account, such as data integrity and consistency across related entities. After the updates are successfully applied, the method responds with a confirmation of the changes or with details of any errors that occurred during the operation, ensuring the client is informed of the outcome.`,
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
