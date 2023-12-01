const { schema } = require('./schemas/response/putNodeLevelRest');
const { schema: xRequest } = require('./schemas/request/putNodeLevelRest');

const openapi = {
  summary: 'Update the information of a specific node level',
  description: `This endpoint updates the existing details of a node level within the curriculum structure. This process typically includes modifying information such as the node's hierarchical level, descriptions, associations, or other pertinent metadata.

**Authentication:** Users must be authenticated and possess valid tokens to perform updates on the node levels. Unauthorized attempts will be met with access denial.

**Permissions:** Adequate privileges are mandatory for a user to make changes to the node levels. The exact permissions required depend on the system's access control configurations but generally entail administrative rights over the curriculum content.

Upon receiving a request, \`putNodeLevelRest\` acts as an intermediary to handle the updating process. It begins by validating the request data against predefined schemas to ensure compliance with the expected input structure. Once validation passes, the handler invokes the \`updateNodeLevel\` method from the \`nodeLevels\` core module. The core module takes charge of executing the update operation, interfacing with the underlying database to apply the changes. The update is articulated over a transaction to ensure atomicity. On successful completion, the endpoint produces a response encapsulating the updated node level details or an error message in case of failure.`,
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
