import PropTypes from 'prop-types';

export const LINK_WRAPPER_DEFAULT_PROPS = {
  useRouter: false,
  url: '',
  id: '',
  children: [],
};

export const LINK_WRAPPER_PROP_TYPES = {
  useRouter: PropTypes.bool,
  url: PropTypes.string,
  id: PropTypes.string,
  children: PropTypes.node,
};
