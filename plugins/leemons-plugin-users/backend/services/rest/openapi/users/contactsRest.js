const { schema } = require('./schemas/response/contactsRest');
const { schema: xRequest } = require('./schemas/request/contactsRest');

const openapi = {
  summary: 'Manage user agent contacts',
  description: `This endpoint is responsible for managing contacts related to a user agent within the system. It involves operations such as listing, updating, creating, or deleting contact information for a user agent.

**Authentication:** Users must be authenticated to manage contact information. Access to this endpoint requires a valid session or authentication token.

**Permissions:** Access to this endpoint is restricted based on user roles and permissions. Only authorized users with the necessary permissions can manage user agent contacts.

Upon receiving a request, the handler first validates the user's authentication and authorization. Assuming the user is permitted, the handler then processes the request by interacting with the underlying services responsible for user agent contacts. Actions such as retrieving the list of contacts, updating contact details, creating new contacts, or removing existing ones are carried out. These operations are orchestrated by invoking methods from the corresponding user agent contacts service, which interact with the database to perform the necessary CRUD (Create, Read, Update, Delete) operations. The final response from this endpoint will include the outcome of these actions, typically in the form of confirmation of success, the updated contact list, or an error message if applicable.`,
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
