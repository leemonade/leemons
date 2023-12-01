const { schema } = require('./schemas/response/getAssignConfigsRest');
const { schema: xRequest } = require('./schemas/request/getAssignConfigsRest');

const openapi = {
  summary: 'Assign saved configuration sets to the requesting entity',
  description: `This endpoint assigns previously saved configuration sets to the requesting entity based on specific criteria or parameters passed in the request. It's used to customize and apply configurations that have been tailored to the entity's requirements.

**Authentication:** Users need to be authenticated in order to assign saved configurations. Unauthorized users will be blocked from accessing this functionality.

**Permissions:** Adequate permissions are required to perform assignments of configuration sets. Access is restricted to users who have been granted permissions to manage and apply configurations.

Upon receiving a request, the \`getAssignConfigsRest\` handler begins by verifying the user's authentication status and confirming whether they possess the necessary permissions to proceed. It then interacts with the underlying configuration management system to retrieve the relevant configuration sets that are eligible for assignment. After identifying the target configuration sets, the handler applies these configurations to the entity specified in the request. The entire process ensures that only properly authorized and intended configurations are assigned accordingly, maintaining the integrity and customizability of the entity's setup. The final response to the user reflects the outcome of the assignation operation.`,
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
