const { schema } = require('./schemas/response/classByIdsRest');
const { schema: xRequest } = require('./schemas/request/classByIdsRest');

const openapi = {
  // summary: "Summary",
  description: `
{
  "summary": "Fetches class details by multiple class IDs",
  "description": "This endpoint retrieves detailed information of classes based on a given list of class IDs. It is designed to accept a batch of IDs and return class details for each ID in the request.

**Authentication:** Users need to be authenticated to request class information. The endpoint will reject requests with no or invalid authentication credentials.

**Permissions:** Users must possess the required permissions to view the details of the requested classes. Access is restricted to only those classes the user is authorized to view.

After receiving the request, the \`classByIdsRest\` handler calls the \`classByIds\` function from the backend core classes. This function takes the array of class IDs and interacts with the database to fetch the corresponding class records. Each class record includes information such as the class title, instructor, schedule, and associated program details. The handler then formats the response data and sends it back to the user as a JSON object, ensuring the client can receive information for multiple classes in a single request."
}
`,
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
