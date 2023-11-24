import PropTypes from 'prop-types';

export const NYACARD_FOOTER_DEFAULT_PROPS = {
  locale: 'en-GB',
};
export const NYACARD_FOOTER_PROP_TYPES = {
  fileType: PropTypes.string,
  fileExtension: PropTypes.string,
  created: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  action: PropTypes.string,
  onAction: PropTypes.func,
  locale: PropTypes.string,
  variant: PropTypes.string,
  variantTitle: PropTypes.string,
  variantIcon: PropTypes.any,
};
