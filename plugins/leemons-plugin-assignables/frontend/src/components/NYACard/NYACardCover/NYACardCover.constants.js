import PropTypes from 'prop-types';

export const NYACARD_COVER_DEFAULT_PROPS = {
  blur: 5,
  height: 144,
  menuItems: [],
  dashboard: false,
  fileIcon: null,
  variantIcon: null,
  fileType: null,
  localizations: {},
  instance: null,
};
export const NYACARD_COVER_PROP_TYPES = {
  name: PropTypes.string,
  height: PropTypes.number,
  cover: PropTypes.string,
  color: PropTypes.string,
  blur: PropTypes.number,
  fileIcon: PropTypes.node,
  parentHovered: PropTypes.bool,
  dashboard: PropTypes.bool,
  isNew: PropTypes.bool,
  badge: PropTypes.string,
  localizations: PropTypes.shape({}),
  instance: PropTypes.shape({}),
};
