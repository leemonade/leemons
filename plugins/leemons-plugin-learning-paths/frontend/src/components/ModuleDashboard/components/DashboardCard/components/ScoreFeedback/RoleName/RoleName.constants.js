import PropTypes from 'prop-types';

export const ROLENAMES_PROP_TYPES = {
  role: PropTypes.shape({
    name: PropTypes.string,
    icon: PropTypes.string,
  }),
};

export const ROLENAMES_DEFAULT_PROPS = {
  role: {
    name: '',
    icon: '',
  },
};
