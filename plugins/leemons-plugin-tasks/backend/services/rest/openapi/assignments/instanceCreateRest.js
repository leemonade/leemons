const { schema } = require('./schemas/response/instanceCreateRest');
const { schema: xRequest } = require('./schemas/request/instanceCreateRest');

const openapi = {
  summary: 'Create a new assignment instance',
  description: `This endpoint is responsible for creating a new assignment instance within a specific course or educational context. It handles the instantiation of assignments based on predefined templates or configurations and assigns them to the intended participants or groups.

**Authentication:** Users need to be authenticated to create new assignment instances. Access is denied if the user's credentials are not verified.

**Permissions:** The user must have 'create_assignment' permission within their role to execute this action. Access without sufficient permissions will result in an authorization error.

Upon receiving a request, the \`instanceCreateRest\` handler first validates the provided input parameters to ensure they meet the necessary schema and logic requirements. It then interacts with the 'Assignments' module to initiate the creation process. The logic includes determining the target group or participants, applying any specific configurations (such as deadlines or unique instructions), and saving the new instance into the system's database. This process might also trigger notifications to inform participants about the new assignment. Once successfully created, the endpoint will respond with the details of the newly created assignment instance, encapsulated within a JSON object.`,
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
