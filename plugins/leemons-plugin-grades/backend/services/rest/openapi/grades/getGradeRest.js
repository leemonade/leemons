const { schema } = require('./schemas/response/getGradeRest');
const { schema: xRequest } = require('./schemas/request/getGradeRest');

const openapi = {
  summary: 'Fetches grades associated with specific student IDs',
  description: `This endpoint retrieves all grade entries for a collection of student IDs provided in the request. It is used to gather academic performance data corresponding to selected students for further evaluation or display.

**Authentication:** Users must be authenticated and have a valid session to access grade data. Non-authenticated requests will be rejected.

**Permissions:** Users need to have the 'view_grades' permission to retrieve grades. Access may be limited to grades of students under the user's purview, depending on roles and access controls set within the application.

The request flow begins with the \`getGradeRest\` handler, which calls the \`gradeByIds\` method in the \`grades\` core module, providing an array of student IDs. The \`gradeByIds\` function interacts with the database to fetch grade records tied to the provided IDs. Subsequently, the handler might invoke additional methods such as \`getGradeScalesByGrade\` from the \`grade-scales\` core and \`getGradeTagsByGrade\` or \`getGradeTagsByIds\` from the \`grade-tags\` core for enriching the grades with relevant metadata. The goal is to construct a comprehensive response that includes grades, scales, and tags related to the students' academic achievements. The final response is sent back as JSON, inclusive of all gathered information.`,
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
