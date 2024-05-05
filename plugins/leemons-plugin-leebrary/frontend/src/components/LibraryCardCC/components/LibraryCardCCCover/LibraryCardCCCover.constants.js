import PropTypes from 'prop-types';

export const LIBRARY_CARD_CC_COVER_PROPTYPES = {
  cover: PropTypes.string,
  color: PropTypes.string,
  fileIcon: PropTypes.element,
  subject: PropTypes.object,
  fileType: PropTypes.string,
  fileExtension: PropTypes.string,
  variantIcon: PropTypes.element,
};

export const LIBRARY_CARD_CC_COVER_DEFAULTPROPS = {
  cover: '',
  color: '',
  fileIcon: null,
  subject: null,
  fileType: '',
  fileExtension: '',
  variantIcon: null,
};
