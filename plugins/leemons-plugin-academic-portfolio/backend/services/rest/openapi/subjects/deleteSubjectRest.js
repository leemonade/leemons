const { schema } = require('./schemas/response/deleteSubjectRest');
const { schema: xRequest } = require('./schemas/request/deleteSubjectRest');

const openapi = {
  summary:
    'Delete a subject and its associated classes from the academic portfolio',
  description: `This endpoint allows for the deletion of a subject and all its associated classes within the academic portfolio system. It ensures the removal of the subject record and any linked class records from the database, maintaining data integrity and consistency.

**Authentication:** Users need to be authenticated to perform deletions. Only requests with valid authentication tokens will be processed.

**Permissions:** This endpoint requires administrative permissions related to subject and class management. Users must have the 'manage_subjects' and 'manage_classes' permissions to execute this action.

The process begins with the validation of the subject's ID provided in the request. The handler then invokes the \`deleteSubjectWithClasses\` method of the \`subjects\` core, which internally calls \`removeClassesByIds\` for any classes linked to the subject. This ensures all data related to the subject, including the classes, is eliminated properly. Following successful deletion, the method updates any affected relational entities and returns a confirmation of the deletion. The response includes a status message indicating the successful removal of the subject and its classes.`,
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
