const { schema } = require('./schemas/response/urlMetadataRest');
const { schema: xRequest } = require('./schemas/request/urlMetadataRest');

const openapi = {
  summary: 'Extract metadata from a given URL',
  description: `This endpoint is responsible for extracting and returning relevant metadata from a specified URL. The metadata information includes details such as the title, description, image, and other significant data that provide insights into the content of the URL.

**Authentication:** Users need to be logged in to request URL metadata extraction. Unauthenticated requests will be rejected.

**Permissions:** The endpoint requires users to have specific permissions to access URL metadata, ensuring that only authorized personnel can perform metadata extraction operations.

Upon receiving a request, the handler for 'urlMetadataRest' initiates a process to extract metadata from the provided URL. It utilizes the 'metascraper' module defined in 'metascraper.js' within the 'leemons-plugin-leebrary' plugin. The module employs a set of rules and filters to analyze the content of the URL and scrape the necessary metadata. This scraped information is then formatted and returned as a JSON object in the endpoint's response, providing the client with detailed insights about the URL's content.`,
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
