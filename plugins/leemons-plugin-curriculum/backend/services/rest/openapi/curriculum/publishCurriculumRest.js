const { schema } = require('./schemas/response/publishCurriculumRest');
const { schema: xRequest } = require('./schemas/request/publishCurriculumRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Publish curriculum details",
  "description": "This endpoint publishes the curriculum details, making them available for students and educators. It transitions the curriculum from a draft state to a published state, ensuring that all the necessary content and structure are in place and ready for use in educational settings.

**Authentication:** Users need to be authenticated to publish the curriculum. Unauthenticated requests will be rejected.

**Permissions:** Users must have the 'publish_curriculum' permission to carry out this action. Attempting to publish a curriculum without the appropriate permissions will result in an authorization failure.

The \`publishCurriculumRest\` action begins by calling the \`publishCurriculum\` method defined in '/Users/rvillares/Desktop/workdir/leemonade/leemons-saas/leemons/plugins/leemons-plugin-curriculum/backend/core/curriculum/publishCurriculum.js'. The method takes the curriculum data as input and validates it to ensure all required fields and content comply with the publication standards. Following validation, the method updates the curriculum's status to 'published' in the database, effectively making the curriculum accessible to its intended audience. Throughout the process, the endpoint ensures that any changes are atomic and consistent, handling exceptions and errors gracefully to provide clear feedback in the HTTP response."
}
`,
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
