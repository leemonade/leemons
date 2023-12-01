const { schema } = require('./schemas/response/deleteSubjectRest');
const { schema: xRequest } = require('./schemas/request/deleteSubjectRest');

const openapi = {
  summary: 'Delete an academic subject and its associated classes',
  description: `This endpoint is responsible for deleting a subject from the academic portfolio along with any associated classes. The operation ensures that all records related to the subject are cleanly removed from the system, including links between the subject and any courses or programs it may have been a part of.

**Authentication:** User authentication is required to ensure secure access to this endpoint. Users must have a valid session or provide credentials to authenticate their request.

**Permissions:** The requesting user must have the necessary permissions to manage academic subjects. This typically includes roles such as academic administrator or program coordinator.

Upon receiving a request to delete a subject, the endpoint first validates the user’s authentication and checks if the user has the required permissions. It then proceeds to call the \`deleteSubjectWithClasses\` method from the \`subjects\` core module. This method orchestrates the deletion process by first removing any classes associated with the subject, calling the \`removeClassesByIds\` function. Afterward, it deletes the subject itself through the \`removeSubjectByIds\` function. Any related subject credits are also cleaned up using the \`removeSubjectCreditsBySubjectsIds\` method. Once the deletion process is completed, the endpoint sends back a confirmation response, confirming the successful removal of the subject and its classes.`,
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
