const { schema } = require('./schemas/response/postGroupRest');
const { schema: xRequest } = require('./schemas/request/postGroupRest');

const openapi = {
  summary: 'Adds a new academic group to the portfolio',
  description: `This endpoint is responsible for adding a new group to the academic portfolio. It involves storing group-related information in the database, such as group name, associated program, and other metadata. The endpoint expects to receive the necessary data to create a new group which then is processed and stored.

**Authentication:** Users must be logged in to interact with this endpoint. Without proper authentication, the request will not be processed.

**Permissions:** This endpoint requires the user to have 'admin' privileges or specific role permissions that allow manipulation of academic group data.

Upon receiving a request, the \`addGroup\` method in the \`group.rest.js\` file is called. This method further interacts with the \`groups\` core where the actual logic for adding a new group to the database is implemented. This includes generating a unique identifier for the group, validating the passed data against predefined schemas, and finally adding the group data to the database. Error handling mechanisms are also in place to manage any issues that may arise during data processing or database operations, ensuring the client receives appropriate feedback on the operation's outcome.`,
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
