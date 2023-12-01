const { schema } = require('./schemas/response/listSubjectClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listSubjectClassesRest');

const openapi = {
  summary: 'Lists all subject classes for a specific academic program',
  description: `This endpoint lists all subject classes associated with a specific academic program. It is designed to provide a comprehensive overview of the classes available within the program, including details such as class identifiers, titles, and schedules.

**Authentication:** Users must be authenticated in order to retrieve the subject class list. Only requests with a valid user session will be processed.

**Permissions:** Users need to have adequate permissions to access details about subject classes. Typically, this would include faculty members, administrative staff, or students enrolled in the program.

Upon receiving a request, the handler calls the \`listSubjectClasses\` function, which is responsible for aggregating the data relevant to the subject classes of the given academic program. The process involves querying the database for classes that match the program criteria and then formatting the data for presentation. The end result is an array of objects, each representing a subject class, sent back to the client as a JSON response.`,
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
