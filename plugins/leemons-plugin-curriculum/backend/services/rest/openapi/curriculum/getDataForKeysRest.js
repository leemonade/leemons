const { schema } = require('./schemas/response/getDataForKeysRest');
const { schema: xRequest } = require('./schemas/request/getDataForKeysRest');

const openapi = {
  summary: 'Extracts specific curriculum data based on provided keys',
  description: `This endpoint is designed to selectively retrieve detailed information from the curriculum based on a set of predefined keys. The data fetched may include details such as curriculum structure, content descriptions, learning outcomes, and any associated metadata that aids in educational planning and assessments.

**Authentication:** User authentication is required to ensure secure access to the curriculum data. Users must provide valid credentials to interact with this endpoint.

**Permissions:** This endpoint necessitates specific permissions tailored to access educational data. Users need to have the 'view_curriculum' permission granted to fetch curriculum-specific information effectively.

Upon receiving a request, the \`getDataForKeys\` handler initiates by validating the provided keys against available data fields in the curriculum database. It employs the \`getDataForKeys\` method in the curriculum core to perform database queries that extract the relevant data based on these keys. This process includes error handling to manage scenarios where keys are invalid or data retrieval fails. The successful execution of this method results in compiling the requested curriculum data, which is then formatted into a JSON response and sent back to the requester, thus providing a clear and structured view of the curriculum based on specified criteria.`,
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
