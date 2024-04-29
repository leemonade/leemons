const { schema } = require('./schemas/response/existDeploymentWithDomainRest');
const {
  schema: xRequest,
} = require('./schemas/request/existDeploymentWithDomainRest');

const openapi = {
  summary: 'Checks if a deployment domain is already in use',
  description: `This endpoint checks whether a specified domain is already in use for another deployment within the system. The purpose is to ensure that no two deployments share the same domain, thereby avoiding conflicts and maintaining domain uniqueness across the platform.

**Authentication:** Users must be authenticated to perform this domain check. Any access attempt without proper authentication will be denied, ensuring that the endpoint's operation is secure.

**Permissions:** Users need to have the 'deployments.manage' permission to check domain usage. This requirement helps ensure that only authorized personnel can perform actions that could potentially affect deployment configurations.

Upon receiving a request, this endpoint invokes the \`isDomainInUse\` function from the \`Deployments\` core. This function receives the domain name as a parameter and checks against existing deployment records in the database to determine if the domain is already assigned. If the domain is in use, the function returns a boolean \`true\`, otherwise, it returns \`false\`. This result is then sent back to the client in a simple JSON format indicating the domain usage status. This streamlined check helps maintain operational integrity by preventing domain conflicts in subsequent deployment processes.`,
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
