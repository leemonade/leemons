const { schema } = require('./schemas/response/listTeacherClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listTeacherClassesRest');

const openapi = {
  summary: 'List classes taught by a specific teacher',
  description: `This endpoint is responsible for fetching a list of classes that are associated with a particular teacher. This includes all the classes that the teacher is currently teaching or has taught in the past within the academic institution's portfolio system.

**Authentication:** Users need to be authenticated to access this endpoint. This ensures that only authorized personnel, such as the teacher themselves or administrative staff, can retrieve this information.

**Permissions:** Users must have the 'view_teacher_classes' permission to list classes tied to a teacher. The permission ensures that only users with the correct level of access can retrieve the details of the classes taught by a teacher.

Upon receiving a request, the 'listTeacherClassesRest' handler starts by validating the user's authentication and permissions. After validation, it calls the 'listTeacherClasses' method from the 'Classes' core service. This method queries the academic portfolio database for all classes linked with the teacher's identifier passed in the request. The flow may involve additional business logic, such as filtering based on parameters like time frame or subject category. Once the data is fetched, it is then formatted according to the response structure and returned to the user in JSON format, providing a comprehensive list of the teacher's classes.`,
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
