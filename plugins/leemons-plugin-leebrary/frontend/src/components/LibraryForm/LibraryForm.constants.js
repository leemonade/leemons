import PropTypes from 'prop-types';

export const LIBRARY_FORM_TYPES = {
  MEDIA_FILES: 'media-files',
  BOOKMARKS: 'bookmarks',
  DOCUMENT: 'document',
  RECORDINGS: 'sessions-recordings',
};

export const LIBRARY_FORM_DEFAULT_PROPS = {
  asset: {},
  labels: {
    title: '',
    featuredImage: '',
    changeImage: '',
    uploadButton: '',
    submitForm: '',
    name: '',
    description: '',
  },
  placeholders: {
    name: '',
    description: '',
    color: '',
  },
  errorMessages: {
    name: '',
    file: '',
  },
  loading: false,
  type: LIBRARY_FORM_TYPES.MEDIA_FILES,
  hideTitle: false,
  externalFileFromDrawer: null,
};
export const LIBRARY_FORM_PROP_TYPES = {
  labels: PropTypes.object,
  placeholders: PropTypes.object,
  helps: PropTypes.object,
  descriptions: PropTypes.object,
  errorMessages: PropTypes.object,
  advancedConfig: PropTypes.shape({
    program: PropTypes.shape({
      show: PropTypes.bool,
    }),
    subjects: PropTypes.shape({
      show: PropTypes.bool,
      showLevel: PropTypes.bool,
      maxOne: PropTypes.bool,
    }),
  }),
  asset: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    fileExtension: PropTypes.string,
    description: PropTypes.string,
    created: PropTypes.string,
    cover: PropTypes.string,
    color: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.string),
  }),
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
  type: PropTypes.oneOf(Object.keys(LIBRARY_FORM_TYPES).map((key) => LIBRARY_FORM_TYPES[key])),
  hideSubmit: PropTypes.bool,
  form: PropTypes.any,
  ContentExtraFields: PropTypes.element,
  editing: PropTypes.bool,
  hideTitle: PropTypes.bool,
  drawerLayout: PropTypes.bool,
  categories: PropTypes.arrayOf(PropTypes.string),
  acceptedFileTypes: PropTypes.arrayOf(PropTypes.string),
  hideCover: PropTypes.bool,
  externalFileFromDrawer: PropTypes.object,
};
