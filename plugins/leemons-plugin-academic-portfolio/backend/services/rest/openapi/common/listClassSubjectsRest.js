const { schema } = require('./schemas/response/listClassSubjectsRest');
const { schema: xRequest } = require('./schemas/request/listClassSubjectsRest');

const openapi = {
  summary: 'Lists classes and subjects for a specific academic program',
  description: `This endpoint allows retrieval of classes and subjects associated with a given academic program. It is designed to provide educators and students with a comprehensive list that brings together all necessary academic scheduling details in one place.

**Authentication:** Access to this endpoint requires the user to be logged in. Any request without a proper authentication token will be rejected.

**Permissions:** Users require specific privileges to fetch class and subject details; typically, these would be roles associated with educational program administration, such as academic staff, program coordinators, or similar.

Upon receiving a request, the handler 'listClassSubjectsRest' calls the \`listClassesSubjects\` method, passing through the relevant program identifiers. The method fetches the data through a series of interactions with the underlying academic portfolio model; it queries the database for classes and subjects linked to the specified program. Then it meticulously compiles a data structure encompassing all classes, the subjects taught within each class, and relevant metadata such as class schedules and subject instructors. The result is then formatted and returned as a structured JSON response, effectively mapping out the academic program's offerings for the requestor.`,
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
