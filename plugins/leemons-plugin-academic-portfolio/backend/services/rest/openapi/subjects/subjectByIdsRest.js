const { schema } = require('./schemas/response/subjectByIdsRest');
const { schema: xRequest } = require('./schemas/request/subjectByIdsRest');

const openapi = {
  summary: 'Fetch subjects by their IDs',
  description: `This endpoint is responsible for retrieving a collection of academic subjects based on an array of provided subject IDs. It is designed to return detailed information about each requested subject, such as their names, codes, descriptions, and other relevant academic metadata.

**Authentication:** Users need to be authenticated to ensure secure access to the subject information. Access will be denied if authentication credentials are not provided or are found to be invalid.

**Permissions:** Users must have the appropriate permission level to retrieve subject information. The required permission level should correspond to the ability to view detailed academic data, possibly reserved for educational staff or administrators.

Upon receiving the request, the handler invokes a method from the academic portfolio core, likely \`subjectByIds\` or similar, with the necessary parameters including the subject IDs. This method interacts with the underlying database to retrieve the requested subjects' details. The process may involve validating the subject IDs, checking user permissions, and formatting the data for the response. Once the data is fetched and properly formatted, it is returned to the user in a structured JSON response, detailing each subject's information contained within the provided IDs.`,
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
