const { schema } = require('./schemas/response/getCurriculumRest');
const { schema: xRequest } = require('./schemas/request/getCurriculumRest');

const openapi = {
  summary: 'Manage and retrieve detailed curriculum data',
  description: `This endpoint facilitates the retrieval and management of detailed curriculum data including its structural components and associated levels. It primarily handles requests related to specific curriculum items or sets of curriculum data, adjusting its responses based on the provided identifiers.

**Authentication:** Users need to be authenticated to interact with the curriculum data endpoints. Any requests without proper authentication will be denied access to the curriculum data.

**Permissions:** The user must have appropriate permissions related to educational content management or specific rights granted for accessing or managing curriculum data.

The flow of this controller starts by validating the user's identity and permissions. It then proceeds to extract curriculum IDs from the request parameters and invokes the \`getCurriculumByIds\` method from the curriculum core service. This method retrieves data for each curriculum ID, including node levels and tree structures, by making subsequent calls to \`nodeLevelsByCurriculum\` and \`nodesTreeByCurriculum\`. The endpoint consolidates all this data to form a comprehensive view of the curriculum, which is then returned to the user in a structured JSON format.`,
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
