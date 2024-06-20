const { schema } = require('./schemas/response/postKnowledgeRest');
const { schema: xRequest } = require('./schemas/request/postKnowledgeRest');

const openapi = {
  summary: 'Adds a new knowledge area to the academic portfolio',
  description: `This endpoint allows for the addition of a new knowledge area into the system's academic portfolio. The action facilitates the creation and organization of knowledge areas as part of educational or institutional structuring.

**Authentication:** Users must be authenticated to create a new knowledge area. The system requires valid authentication credentials for accessing this endpoint.

**Permissions:** The user needs specific permissions related to managing academic content. The required permission is typically 'manage_academic_knowledge_areas' or a similar scope that authorizes the user to add and modify educational structures.

The process initiated by this endpoint involves the \`addKnowledgeArea\` function from the \`knowledges\` core module. Upon receiving the request, the method processes the input data, typically consisting of the knowledge area's name and description, and then inserts it into the database. This operation involves validating the input against predefined schemas to ensure compliance with data standards. After successful insertion, a confirmation is sent back to the user, providing feedback on the operation's success and the details of the newly added knowledge area.`,
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
