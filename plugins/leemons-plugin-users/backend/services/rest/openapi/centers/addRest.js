const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add a new center to the platform',
  description: `This endpoint allows the creation of a new educational or organizational center within the platform. It involves the addition of center details into the system's database, enabling centralized management and access to specific functionalities based on the center's characteristics.

**Authentication:** User authentication is required to ensure secure access and operation within the endpoint. An authorized login is necessary to proceed with adding new centers.

**Permissions:** Proper authorization is mandatory, and users need specific permissions related to center management. These permissions ensure that only authorized personnel can add new centers, maintaining operational integrity and security.

Upon receiving the request, the endpoint initially validates the provided data against predefined schemas to ensure compliance with the expected format and completeness. If validation passes, it proceeds to invoke the \`add\` function from the \`centers\` core module. This function is responsible for inserting the new center's details into the database. Throughout this process, transactional integrity is maintained to prevent partial data entry and to ensure reliable operations. Finally, upon successful addition of the center, a confirmation response is generated and returned to the user, indicating successful execution of the request.`,
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
