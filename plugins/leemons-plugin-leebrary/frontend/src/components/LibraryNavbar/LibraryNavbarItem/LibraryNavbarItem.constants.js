import PropTypes from 'prop-types';

export const LIBRARY_NAVBAR_ITEM_DEFAULT_PROPS = {
  selected: false,
  disabled: false,
};
export const LIBRARY_NAVBAR_ITEM_PROP_TYPES = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  label: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};
