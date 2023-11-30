import PropTypes from 'prop-types';

export const NYACARD_COVER_DEFAULT_PROPS = {
  blur: 5,
  height: 144,
  menuItems: [],
  dashboard: false,
  fileIcon: null,
  variantIcon: null,
  fileType: null,
};
export const NYACARD_COVER_PROP_TYPES = {
  name: PropTypes.string,
  height: PropTypes.number,
  cover: PropTypes.string,
  color: PropTypes.string,
  blur: PropTypes.number,
  fileIcon: PropTypes.node,
  // deadlineProps: PropTypes.shape(LIBRARY_CARD_DEADLINE_PROP_TYPES),
  parentHovered: PropTypes.bool,
  // menuItems: PropTypes.arrayOf(PropTypes.shape(LIBRARY_CARD_MENU_ITEM)),
  dashboard: PropTypes.bool,
  // subject: SUBJECT_PROPS,
  isNew: PropTypes.bool,
  // role: PropTypes.oneOf(LIBRARYCARD_ASSIGMENT_ROLES),
  badge: PropTypes.string,
};
