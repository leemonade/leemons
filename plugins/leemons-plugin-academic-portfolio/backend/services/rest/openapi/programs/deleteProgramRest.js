const { schema } = require('./schemas/response/deleteProgramRest');
const { schema: xRequest } = require('./schemas/request/deleteProgramRest');

const openapi = {
  summary: 'Delete academic program(s) by ID',
  description: `This endpoint facilitates the deletion of one or multiple academic programs based on their identifier(s). Deleted programs are removed from the system along with associated data such as courses, groups, and subjects within those programs.

**Authentication:** Authentication is required to ensure secure access to program deletion functionality. The user must provide valid credentials before proceeding with the request.

**Permissions:** The user must have specific administrative permissions that grant the capability to delete academic programs. Lack of the necessary permissions will result in denial of access to this endpoint.

Upon receiving a delete request, the handler invokes \`removeProgramByIds\` from the \`programs\` core, supplying it with an array of program ID(s) obtained from the request parameters. This method coordinates multiple actions: it may need to remove associated entities like program configurations, centers, groups, courses, and more, via additional methods such as \`removeProgramConfigsByProgramIds\`, \`removeGroupByIds\`, \`removeClassesByIds\`, and so forth. The entire operation is transactional to ensure that either all related data is removed or none at all in the event of a failure. After successful deletion, the endpoint returns a confirmation of the deletion process.`,
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
