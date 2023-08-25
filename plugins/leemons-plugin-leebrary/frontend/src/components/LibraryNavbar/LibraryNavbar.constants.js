import PropTypes from 'prop-types';

export const LIBRARY_NAVBAR_DEFAULT_PROPS = {
  labels: {
    title: '',
    uploadButton: '',
    quickAccess: '',
    createNewTitle: '',
    uploadTitle: '',
    fileUploadTitle: '',
    fileUploadSubtitle: '',
  },
  categories: [],
  selectedCategory: null,
  loading: false,
};
export const LIBRARY_NAVBAR_PROP_TYPES = {
  labels: PropTypes.shape({
    uploadButton: PropTypes.string,
    quickAccess: PropTypes.string,
    createNewTitle: PropTypes.string,
    uploadTitle: PropTypes.string,
    fileUploadTitle: PropTypes.string,
    fileUploadSubtitle: PropTypes.string,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      icon: PropTypes.node,
      name: PropTypes.string,
      key: PropTypes.string,
      creatable: PropTypes.bool,
      createUrl: PropTypes.string,
    })
  ),
  selectedCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onNav: PropTypes.func,
  onFile: PropTypes.func,
  onNew: PropTypes.func,
  loading: PropTypes.bool,
};
