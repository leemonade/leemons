const { schema } = require('./schemas/response/getRest');
const { schema: xRequest } = require('./schemas/request/getRest');

const openapi = {
  summary: 'Calculate and retrieve weighted scores for assigned tasks',
  description: `This endpoint calculates and retrieves weighted scores for various tasks assigned to users. It processes data according to configured weighting parameters to ensure precise calculation of task performance metrics.

**Authentication:** Users must be authenticated to access this endpoint. Requests made without proper authentication will be rejected, ensuring that only authorized users can retrieve score data.

**Permissions:** This endpoint requires users to have specific permissions related to viewing scores. Without sufficient permissions, the request will not be processed, and access will be denied.

The endpoint begins by invoking the \`getWeights\` method from the \`Weights\` core module. It uses the passed context (ctx), which includes user details and authentication state, to verify permissions and user identity. The method aggregates score data from various sources, relying on predefined weights, which are applied to calculate the final score for each task. The results are then formatted into a response that provides detailed score information, adhering to the strict data protection and privacy guidelines outlined in the user's permissions.`,
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
