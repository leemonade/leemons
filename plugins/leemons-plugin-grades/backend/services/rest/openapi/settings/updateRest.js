const { schema } = require('./schemas/response/updateRest');
const { schema: xRequest } = require('./schemas/request/updateRest');

const openapi = {
  summary: 'Update grading settings',
  description: `This endpoint allows for the modification of the grading settings within the system. It enables the update of various configurations related to how grades are calculated and displayed.

**Authentication:** Users must be authenticated to update grading settings. Unauthenticated requests will be rejected.

**Permissions:** Users need to have 'manage_grading_settings' permission to modify the grading settings.

Upon receiving a request, the endpoint first validates user permissions to ensure that only authorised individuals can make changes to the settings. It then proceeds to call the \`update\` function from the \`Settings\` core service with the provided settings data. This function is responsible for merging the new settings with existing ones and persisting these changes to the database. After successful updation, the endpoint returns a confirmation with the updated settings object.`,
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
