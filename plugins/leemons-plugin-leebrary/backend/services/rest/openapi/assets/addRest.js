const { schema } = require('./schemas/response/addRest');
const { schema: xRequest } = require('./schemas/request/addRest');

const openapi = {
  summary: 'Add new digital asset to the library',
  description: `This endpoint handles the addition of a new digital asset to the platform's library. It facilitates users to upload and categorize new content, such as books, media files, or other educational resources, making these assets available for access and use across the platform.

**Authentication:** User authentication is mandatory to ensure secure upload and proper attribution of the uploaded assets to the respective user accounts. An unauthorized or unauthenticated request will be rejected.

**Permissions:** The user must have the 'add_asset' permission within their role to upload new assets. This permission check ensures that only authorized users can add content to the library.

Upon receiving a request, the endpoint first validates the user's authentication and permissions. Assuming all checks pass, the service then proceeds to handle the file upload, metadata assignment, and category association using dedicated services such as \`handleFileUpload\`, \`handleCategoryData\`, and \`createAssetInDb\`. These methods collectively ensure that the asset is appropriately stored, categorized, and recorded in the database. The entire process encapsulates data validation, permission checks, and structured data entry, culminating in a status response that indicates whether the asset has been successfully added.`,
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
