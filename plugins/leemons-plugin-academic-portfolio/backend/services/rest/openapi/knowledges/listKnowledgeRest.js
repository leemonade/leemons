const { schema } = require('./schemas/response/listKnowledgeRest');
const { schema: xRequest } = require('./schemas/request/listKnowledgeRest');

const openapi = {
  summary: 'Lists all academic knowledges available',
  description: `This endpoint provides a comprehensive list of all academic knowledges available within the platform. It's intended to allow users to browse and select from an array of academic subjects, skills, and competencies.

**Authentication:** Users must be authenticated to request the list of academic knowledges. Requests without proper authentication will be rejected.

**Permissions:** This endpoint requires the user to have specific permissions related to viewing academic content. Users without the necessary permissions will not be able to retrieve the data.

The \`listKnowledgesRest\` handler initiates a process that involves multiple steps to ensure the correct data is retrieved and sent to the user. It starts by calling the \`listKnowledges\` method from the \`knowledges\` core module. This method's responsibility is to query the database and collect all entries that represent academic knowledge in the system. After retrieving the data, the method processes it to fit the expected format and then the controller returns the formatted list as a response in JSON format, providing clients with the information necessary to understand and interact with the academic offerings of the platform.`,
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
