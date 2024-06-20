const { schema } = require('./schemas/response/getGradeRest');
const { schema: xRequest } = require('./schemas/request/getGradeRest');

const openapi = {
  summary: 'Fetches detailed grade information for specified IDs',
  description: `This endpoint is designed to retrieve comprehensive grade details based on the provided grade IDs. The retrieved information includes but is not limited to the grade score, associated tags, and grading scale details.

**Authentication:** Access to this endpoint requires the user to be logged in. Authentication ensures that grade information is securely accessed and protects the integrity of the data.

**Permissions:** This endpoint requires that the user has permission to view the specific grades. Typically, this means that the user must either be the instructor for the course associated with the grades, an administrator, or the student to whom the grades belong.

The handler begins by receiving a list of grade IDs through the request parameters. It then calls the \`gradeByIds\` method in the \`grades\` core, which queries the database for the grade details corresponding to these IDs. Subsequently, it invokes the \`getGradeScalesByGrade\` and \`getGradeTagsByGrade\` from their respective modules to append additional contextual information about each grade. These operations amalgamate data from different sources to provide a thorough view of each grade's context and standing within an educational or training environment. The response then compiles and returns this data as a JSON object for the client.`,
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
