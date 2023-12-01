const { schema } = require('./schemas/response/postCourseRest');
const { schema: xRequest } = require('./schemas/request/postCourseRest');

const openapi = {
  summary: 'Creates a new course in the academic portfolio',
  description: `This endpoint handles the creation of a new course within the academic portfolio management system. It is responsible for parsing the course data submitted by the user, validating it against predefined rules, and storing it in the institution's academic database.

**Authentication:** A valid session is required to access this endpoint. Users need to be authenticated and possess a valid access token that must be included in the request headers.

**Permissions:** Users must have the 'course.create' permission to carry out this operation. Without this permission, the request will be rejected, and an appropriate error message will be returned.

Upon receiving a request, the endpoint invokes a service action that interacts with the academic portfolio's business logic. The service validates incoming data against the academic model's schema to ensure all required fields are present and correctly formatted. If validation passes, the service then proceeds to create a new course record in the database, associating it with the relevant academic entities. The method involved in this process ensures transactional integrity, such that in the event of an error, changes are rolled back to maintain a consistent state. Once the course is successfully created, a confirmation is returned to the user along with the new course's details, or in the case of failure, an error message detailing what went wrong.`,
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
