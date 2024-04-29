const { schema } = require('./schemas/response/postSubjectTypeRest');
const { schema: xRequest } = require('./schemas/request/postSubjectTypeRest');

const openapi = {
  summary: 'Adds a new subject type to the academic portfolio',
  description: `This endpoint allows for the creation of a new subject type within the academic portfolio system. A subject type might categorize subjects into various academic disciplines or types, such as mathematics, science, arts, etc.

**Authentication:** Users need to be authenticated to create a new subject type. The action will validate user credentials before processing the request.

**Permissions:** Only users with administrational privileges over the academic portfolio are allowed to add new subject types, ensuring that only authorized personnel can make these alterations.

Upon receiving a request, the \`postSubjectType\` action in the \`subjectType.rest.js\` file is triggered. This action internally calls the \`addSubjectType\` method from the \`subject-type\` core module. This method, after validating the input parameters, proceeds to insert the new subject type into the system's database. Once the database operation is successful, a confirmation response is returned to the client, indicating the successful creation of the new subject type.`,
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
