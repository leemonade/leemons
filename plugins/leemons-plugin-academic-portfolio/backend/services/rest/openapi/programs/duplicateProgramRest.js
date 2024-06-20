const { schema } = require('./schemas/response/duplicateProgramRest');
const { schema: xRequest } = require('./schemas/request/duplicateProgramRest');

const openapi = {
  summary: 'Duplicate academic programs based on specified IDs',
  description: `This endpoint duplicates one or more academic programs using their unique identifiers. The duplication process includes copying all details, configurations, associated subjects, courses, and any related entities under the programs to create new instances of each with new identifiers.

**Authentication:** Users must be authenticated to use this endpoint. Unauthenticated users or those with invalid tokens will be denied access.

**Permissions:** This endpoint requires administrative privileges or specific academic management permissions. Users without these permissions will be unable to execute the duplication process.

The endpoint begins by validating the provided program IDs against the database to ensure they exist and are accessible under the user's privileges. Subsequently, it invokes the \`duplicateProgramByIds\` method in the backend 'programs' core, which handles the intricacies of the duplication. This includes deep cloning of program configurations, subjects linked to the program, associated courses, and any other nested entities. Each cloned item is saved with new IDs ensuring no conflicts in the database. On successful completion, the endpoint responds with the IDs of the newly created programs, signifying a successful duplication.`,
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
