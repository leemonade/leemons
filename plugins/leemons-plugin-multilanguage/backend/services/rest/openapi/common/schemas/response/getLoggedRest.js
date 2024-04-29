// automatic hash: 4cb5642ea5198cf90816a9430328cb7b63c1b9802b51d1522d12ebc357eae527
const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  description: '',
  type: 'object',
  properties: {
    items: {
      type: 'object',
      properties: {
        'leebrary.pickerDrawer.header.title': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.tabs.library': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.tabs.new': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.filters.search.label': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.filters.search.placeholder': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.filters.resources.label': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.filters.resources.placeholder': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.filters.mediaType.label': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.filters.mediaType.placeholder': {
          type: 'string',
          minLength: 1,
        },
        'leebrary.pickerDrawer.filters.mediaType.allTypes': {
          type: 'string',
          minLength: 1,
        },
      },
      required: [
        'leebrary.pickerDrawer.header.title',
        'leebrary.pickerDrawer.tabs.library',
        'leebrary.pickerDrawer.tabs.new',
        'leebrary.pickerDrawer.filters.search.label',
        'leebrary.pickerDrawer.filters.search.placeholder',
        'leebrary.pickerDrawer.filters.resources.label',
        'leebrary.pickerDrawer.filters.resources.placeholder',
        'leebrary.pickerDrawer.filters.mediaType.label',
        'leebrary.pickerDrawer.filters.mediaType.placeholder',
        'leebrary.pickerDrawer.filters.mediaType.allTypes',
      ],
    },
  },
  required: ['items'],
};

module.exports = { schema };
