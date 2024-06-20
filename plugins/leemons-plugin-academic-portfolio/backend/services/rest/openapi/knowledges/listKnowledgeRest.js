const { schema } = require('./schemas/response/listKnowledgeRest');
const { schema: xRequest } = require('./schemas/request/listKnowledgeRest');

const openapi = {
  summary: 'List available knowledge areas within the academic portfolio',
  description: `This endpoint lists all available knowledge areas defined in the academic portfolio system. It is intended to provide an overview of all educational or research domains categorized within the platform.

**Authentication:** Users must be authenticated to retrieve knowledge areas. Access without proper authorization will be denied, ensuring that only authorized personnel can obtain this information.

**Permissions:** The user needs to have 'view_knowledge_areas' permission to access this data. If the user lacks the necessary permissions, the request will be rejected, ensuring compliance with the system's security protocols.

Upon receiving a request, this endpoint calls the \`listKnowledgeAreas()\` method from the underlying knowledge management service. This method queries the database for all entries labeled as knowledge areas and compiles them into a structured list. This comprehensive processing involves checking the user's permissions, ensuring they have the rights to view the information. The data then is returned as a JSON array filled with knowledge areas, categorized and ready for further frontend use or application integration.`,
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
