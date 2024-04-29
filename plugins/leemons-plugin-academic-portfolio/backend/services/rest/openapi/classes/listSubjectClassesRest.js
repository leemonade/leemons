const { schema } = require('./schemas/response/listSubjectClassesRest');
const {
  schema: xRequest,
} = require('./schemas/request/listSubjectClassesRest');

const openapi = {
  summary: 'List subject classes based on provided criteria',
  description: `This endpoint lists all subject classes that match the provided criteria. It is primarily used to retrieve detailed information about classes linked to specific subjects in the academic portfolio of the educational institution.

**Authentication:** Users must be authenticated to access this endpoint. Unauthenticated requests will be denied, ensuring that only authorized users can fetch class data.

**Permissions:** Access to this endpoint requires \`view_classes\` permission. Users without this permission will not be able to retrieve any class data, safeguarding sensitive academic information.

The endpoint initiates by calling the \`listSubjectClassesRest\` method, which accesses the \`listSubjectClasses\` from the core classes module. This method takes search parameters specified by the user and queries the academic database to find matching class entries. The search can be based on various criteria such as subject ID, time of year, or teacher ID. Once the relevant classes are identified, they are formatted and returned as a JSON array, providing comprehensive details like class schedules, involved instructors, and subject correlation.`,
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
