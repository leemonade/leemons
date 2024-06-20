const { schema } = require('./schemas/response/generateCurriculumRest');
const {
  schema: xRequest,
} = require('./schemas/request/generateCurriculumRest');

const openapi = {
  summary: 'Generate curriculum structure based on academic portfolio',
  description: `This endpoint allows the creation or updating of curriculum structures derived from an academic portfolio. The curriculum is built by analyzing the node levels provided in the portfolio and organizing them into a curriculum framework suitable for educational planning and tracking.

**Authentication:** User authentication is mandatory for accessing this endpoint. Unauthenticated access attempts will be rejected.

**Permissions:** The user must have 'curriculum_modify' permission to execute this operation. This ensures that only authorized personnel can make changes to curriculum structures.

The controller handler for this endpoint begins by invoking the \`generateCurriculumNodesFromAcademicPortfolioByNodeLevels\` function found within the curriculum core module. This function takes node levels from the user's academic portfolio as inputs and processes them to create a structured layout of curriculum nodes. Each node represents a specific academic or educational element that is part of a comprehensive curriculum. After generating these nodes, they are organized into a tree structure using the \`nodesTreeByCurriculum\` method, which aligns them according to their hierarchical relationships within the curriculum framework. The endpoint ultimately responds with a JSON structure representing the created or updated curriculum, detailing the arrangement of nodes and their respective levels.`,
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
