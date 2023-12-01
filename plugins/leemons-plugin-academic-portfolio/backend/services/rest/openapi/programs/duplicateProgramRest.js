const { schema } = require('./schemas/response/duplicateProgramRest');
const { schema: xRequest } = require('./schemas/request/duplicateProgramRest');

const openapi = {
  summary: 'Duplicates an academic program based on provided IDs',
  description: `This endpoint is responsible for replicating an existing academic program. The duplication process includes copying program information, associated courses, groups, subjects, and other related elements to create a new, similar program structure that can then be customized without affecting the original program.

**Authentication:** Users need to be authenticated to initiate the program duplication process. The endpoint requires a valid session and will deny access if authentication credentials are not provided or are invalid.

**Permissions:** The user must have the necessary permissions to perform academic program duplications. Typically, this would be reserved for administrative roles that have the authority to manage educational programs and their structures.

Upon receiving a request to duplicate a program, the 'duplicateProgramRest' handler first validates the provided program IDs. It then calls the 'duplicateProgramByIds' method, passing necessary identifiers as parameters. This method interacts with the database to clone the selected program's records, including all related configurations and associations. The duplication process ensures that all new entities have unique identifiers while retaining a reference to the original program's structure. Once the process is complete, the handler returns a success response with the details of the newly created program. If any errors occur during duplication, it provides an appropriate error message indicating the failure reason.`,
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
