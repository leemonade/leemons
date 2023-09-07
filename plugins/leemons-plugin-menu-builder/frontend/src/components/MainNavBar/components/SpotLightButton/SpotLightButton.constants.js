import PropTypes from 'prop-types';

export const SPOTLIGHT_BUTTON_DEFAULT_PROPS = {
  onClick: () => {},
  isCollapsed: false,
  ligthMode: false,
};

export const SPOTLIGHT_BUTTON_PROP_TYPES = {
  onClick: PropTypes.func,
  isCollapsed: PropTypes.bool,
  ligthMode: PropTypes.bool,
};
