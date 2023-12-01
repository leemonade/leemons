const { schema } = require('./schemas/response/postSubjectRest');
const { schema: xRequest } = require('./schemas/request/postSubjectRest');

const openapi = {
  summary: 'Create a new academic subject',
  description: `This endpoint is responsible for the creation of a new academic subject within the system. It handles the intake of subject information, verifies the necessary course associations, sets the subject's credits and internal ID, and adds the subject to the appropriate academic program.

**Authentication:** User authentication is necessary to access this endpoint. Without proper authentication, the user will be unable to post new subject data.

**Permissions:** Users need to have the appropriate permissions to create academic subjects. Insufficient permissions will prevent the operation and return an error.

Upon receiving a request, the \`postSubjectRest\` handler starts by validating the submitted subject data against predefined forms. It checks if the subject requires a course by calling the \`subjectNeedCourseForAdd\` method. If a course is necessary, the handler verifies the ability of the linked program to have courses through \`programCanHaveCoursesOrHaveCourses\`. It gathers the program's course indices using \`getProgramCourses\` and checks for multi-course associations via \`programHaveMultiCourses\`. After these validations, it sets the subject's credits using \`setSubjectCredits\` and assigns an internal ID with \`setSubjectInternalId\`. Finally, the information is handed off to the \`addSubject\` function to store the new subject in the system's database. The response to the client includes confirmation of the successful creation or details of any encountered errors.`,
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
