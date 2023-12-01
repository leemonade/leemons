const {
  schema,
} = require('./schemas/response/duplicateGroupWithClassesUnderNodeTreeRest');
const {
  schema: xRequest,
} = require('./schemas/request/duplicateGroupWithClassesUnderNodeTreeRest');

const openapi = {
  summary:
    'Duplicate a group along with its classes under a specific node tree',
  description: `This endpoint duplicates a group along with its associated classes that come under a specified node tree. The duplication process includes copying the group's structure, settings, and any classes that are nested within the node tree hierarchy.

**Authentication:** Users need to be authenticated in order to duplicate groups and classes. An authentication failure will prevent access to the duplicating functionalities.

**Permissions:** This action requires administrative permissions to modify group and class data. Users attempting to duplicate without the proper permissions will be denied access.

Upon receiving a duplication request, the handler invokes the \`duplicateGroupWithClassesUnderNodeTreeByIds\` method from the \`Groups\` core service. It works by first retrieving all classes under the node tree using the \`getClassesUnderNodeTree\` method to ensure all associated data is captured accurately. The duplicating process includes generating new identifiers for the groups and classes while keeping the properties and linkages intact. Once duplication is completed, the endpoint responds back to the requester with the identifiers of the newly created groups and classes, indicating a successful operation. The response payload includes necessary details about the duplicated groups and classes structured in a JSON format.`,
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
