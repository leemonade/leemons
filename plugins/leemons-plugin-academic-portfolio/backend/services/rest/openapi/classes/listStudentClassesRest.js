const { schema } = require('./schemas/response/listStudentClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listStudentClassesRest');

const openapi = {
  summary: 'List all classes associated with a specific student',
  description: `This endpoint lists all the academic classes that a specific student is currently enrolled in or has completed. This involves fetching data that includes the class details, timings, and any other related academic information that pertains to the student's academic record.

**Authentication:** Users need to be authenticated to access the list of classes for a student. Authentication ensures that only authorized users such as educational staff or the students themselves can access personal academic information.

**Permissions:** Permissions required include roles such as academic staff or administrator. Specific access rights might be required to view detailed student class data to ensure confidentiality and adherence to educational standards.

Upon request, the 'listStudentClassesRest' handler in the 'class.rest.js' starts by validating the user's authentication and permission levels. The main process involves calling the \`listStudentClasses\` function from the \`classes\` core module, which retrieves all class data associated with the student's ID provided in the request. This function queries the database for relevant class entries and compiles them into a structured format. The response is then prepared to include all pertinent details about the classes, formatted in JSON for client-side integration.`,
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
