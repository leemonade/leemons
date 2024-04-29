const { schema } = require('./schemas/response/publishCurriculumRest');
const { schema: xRequest } = require('./schemas/request/publishCurriculumRest');

const openapi = {
  summary: 'Publish curriculum configurations for availability',
  description: `This endpoint is responsible for making curriculum configurations available for use across the platform. It involves validating and setting up the necessary details to ensure the curriculum can be accessed and utilized by the intended parties.

**Authentication:** Users must be authenticated to perform this operation. A check is done to ensure that the request is accompanied by a valid authentication token.

**Permissions:** The user needs to have 'curriculum_publish' permission to execute this operation. Any attempt by users lacking this permission will result in an authorization error.

The process begins by invoking the \`publishCurriculum\` method located in the \`curriculum/index.js\` file. The method receives parameters that define which curriculum is to be published and any specific settings associated with the publication process. It interacts with underlying databases and services to update curriculum states and propagate changes where necessary. This method ensures all configurable elements are correctly set and verifies the integrity of the data before marking the curriculum as published. Upon successful completion, the endpoint returns a response indicating the curriculum has been published.`,
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
