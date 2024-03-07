import PropTypes from 'prop-types';

export const NAV_ITEM_DEFAULT_PROPS = {
  label: '',
  childrenCollection: [],
  useRouter: false,
  activeIconSvg: '',
  iconSvg: '',
  iconAlt: '',
  active: false,
  url: '',
  id: '',
  isCollapsed: false,
  expandedItem: '',
  onOpen: () => {},
  isNew: false,
};

export const NAV_ITEM_PROP_TYPES = {
  label: PropTypes.string,
  childrenCollection: PropTypes.array,
  useRouter: PropTypes.bool,
  activeIconSvg: PropTypes.string,
  iconSvg: PropTypes.string,
  iconAlt: PropTypes.string,
  active: PropTypes.bool,
  url: PropTypes.string,
  id: PropTypes.string,
  isCollapsed: PropTypes.bool,
  expandedItem: PropTypes.string,
  onOpen: PropTypes.func,
  isNew: PropTypes.bool,
};
