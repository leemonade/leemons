const { schema } = require('./schemas/response/getDatasetFormRest');
const { schema: xRequest } = require('./schemas/request/getDatasetFormRest');

const openapi = {
  summary: 'Fetches dataset form associated with family structures',
  description: `This endpoint is designed to fetch the dataset form configurations that are used in creating or editing family structures within the system. The form is a critical component for users to input accurate data relevant to the family constructs outlined by the application's logic.

**Authentication:** Users must be authenticated to view or interact with the family dataset forms. Authentication ensures that the request is associated with a valid and active user session.

**Permissions:** Access to the dataset form is governed by specific permissions that ensure only users with 'edit families' capability or similar rights can fetch the form data. This ensures that sensitive information or tools used in managing family data are strictly regulated.

Upon receiving a request, the handler for the \`getDatasetFormRest\` method begins by validating the user's authentication and permissions. If these checks pass, it calls the \`getDatasetForm\` service from the \`familyFormService\`. This service is responsible for retrieving the form configuration details from a stored layout or predefined configuration. The method ensures that the retrieved form matches the current user's permissions and operational scope to interact with family data. Once the data is fetched and validated, it is formatted appropriately and sent back as a JSON response, encapsulating all necessary fields and configurations required for the user interface to render the family data form correctly.`,
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
