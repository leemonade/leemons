const { schema } = require('./schemas/response/listTeacherClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listTeacherClassesRest');

const openapi = {
  summary: 'Lists classes associated with a specific teacher',
  description: `This endpoint provides a list of all classes that a specific teacher is associated with, allowing users to view the teaching schedule, enrolled courses, and any relevant educational data tied to that teacher.

**Authentication:** User authentication is required to access this endpoint. Access will be denied for requests without a valid authentication token or session.

**Permissions:** The user must have the 'view_teacher_classes' permission to retrieve this information. Without appropriate permissions, the request will result in access denial.

The endpoint operates by first validating the authentication and permissions of the requester. Upon successful validation, it invokes the 'listTeacherClasses' method from the academic portfolio core. This method queries the database to fetch detailed class records where the teacher's ID matches the specified in the request. Each class detail includes the course title, schedule times, and participating student count. The process ensures efficient data retrieval and structuring to produce a meaningful output formatted as a JSON list, returned in the endpoint's response.`,
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
