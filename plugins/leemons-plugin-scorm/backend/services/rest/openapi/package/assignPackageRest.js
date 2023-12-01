const { schema } = require('./schemas/response/assignPackageRest');
const { schema: xRequest } = require('./schemas/request/assignPackageRest');

const openapi = {
  summary: 'Assign SCORM package to a user or group',
  description: `This endpoint facilitates the assignment of a SCORM package, a standardized method of packaging web-based educational content, to either an individual user or a group of users.

**Authentication:** Users must be authenticated and have a valid session to perform package assignments.

**Permissions:** Appropriate access rights are required to assign a SCORM package. The user must possess the capability to allocate educational resources within the given context.

Upon receiving a request, the handler \`assignPackageRest\` invokes the \`assignPackage\` method from the \`package\` core. The method expects parameters pertaining to the targeted user or group and the specific SCORM package to be assigned. It manages the association between the users and the package, ensuring the content is accessible to be launched and tracked by the system. The operation's success or failure is represented in the response, detailing the outcome of the assignment attempt.`,
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
