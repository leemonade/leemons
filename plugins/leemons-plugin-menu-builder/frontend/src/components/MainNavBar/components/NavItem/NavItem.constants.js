import PropTypes from 'prop-types';

export const NAV_ITEM_DEFAULT_PROPS = {
  label: '',
  children: [],
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
  lightMode: false,
};

export const NAV_ITEM_PROP_TYPES = {
  label: PropTypes.string,
  children: PropTypes.array,
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
  lightMode: PropTypes.bool,
};
