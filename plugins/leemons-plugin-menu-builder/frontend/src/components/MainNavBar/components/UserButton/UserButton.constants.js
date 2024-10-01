import PropTypes from 'prop-types';

export const USER_BUTTON_DEFAULT_PROPS = {
  name: '',
  surnames: '',
  isCollapsed: false,
  session: {},
  sessionMenu: {},
  onOpen: () => {},
  expandedItem: null,
  isSubItemActive: false,
};

export const USER_BUTTON_PROP_TYPES = {
  name: PropTypes.string,
  surnames: PropTypes.string,
  isCollapsed: PropTypes.bool,
  session: PropTypes.object,
  sessionMenu: PropTypes.object,
  onOpen: PropTypes.func,
  expandedItem: PropTypes.string,
  isSubItemActive: PropTypes.bool,
  lightMode: PropTypes.bool,
};
