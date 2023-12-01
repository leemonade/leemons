const { schema } = require('./schemas/response/generateCurriculumRest');
const {
  schema: xRequest,
} = require('./schemas/request/generateCurriculumRest');

const openapi = {
  summary: 'Generates curriculum structure from academic portfolio',
  description: `This endpoint generates a hierarchical curriculum structure based on the academic portfolio provided by the user and the predefined node levels. It constructs an organized curriculum flow, including the necessary components and relationships, that serves as a blueprint for educational paths.

**Authentication:** Users need to be authenticated to initiate the curriculum generation process. Unauthenticated requests will be rejected with appropriate error messages.

**Permissions:** Users must possess the 'curriculum.create' permission to execute this action. Without the required permission, the system will prevent the operation and return an authorization error.

Upon receiving a request, the handler calls \`generateCurriculumNodesFromAcademicPortfolioByNodeLevels\` method from the 'curriculum' core. This core function processes the input data, applying a combination of curriculum rules and academic portfolio details to formulate the curriculum nodes and levels. Next, it integrates these nodes within the respective levels, ensuring a coherent flow within the curriculum. Once the process is complete, the result is sent back through the RESTful service, providing the client with the newly formed curriculum structure in a JSON format.`,
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
