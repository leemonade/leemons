const { schema } = require('./schemas/response/urlMetadataRest');
const { schema: xRequest } = require('./schemas/request/urlMetadataRest');

const openapi = {
  summary: 'Extracts URL metadata for enhanced content previews',
  description: `This endpoint is designed to fetch and parse metadata from URLs to enhance content previews such as title, description, and image. This functionality is crucial for applications that require rich link previews to provide better context and visual cues to users.

**Authentication:** User authentication is mandatory to ensure that only authorized users can request metadata extraction for URLs. Without valid user credentials, the request will be denied.

**Permissions:** The user must have appropriate permissions to extract metadata from specified URLs. This generally includes permissions to access the URLs or domains from which metadata is being extracted.

Upon receiving a request, the endpoint utilizes the \`metascraper\` library, configured within the platform, to process the URL provided by the user. It initiates a network call to retrieve HTML content from the URL and then employs a series of scraping rules to extract metadata like the site title, main image, and description. This extracted metadata will then be formatted accordingly and sent back to the client as a structured JSON response, effectively enhancing the content display for any application's frontend.`,
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
