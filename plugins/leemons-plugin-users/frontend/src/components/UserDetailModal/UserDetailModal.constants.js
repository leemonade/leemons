import PropTypes from 'prop-types';

export const USER_DETAIL_MODAL_DEFAULT_PROPS = {
  labels: {
    personalInformation: '',
    badges: '',
  },
};
export const USER_DETAIL_MODAL_PROP_TYPES = {
  user: PropTypes.shape({
    name: PropTypes.string,
    surnames: PropTypes.string,
    avatar: PropTypes.string,
    rol: PropTypes.string,
    email: PropTypes.string,
    number: PropTypes.string,
    birthday: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  }),
  labels: PropTypes.shape({
    personalInformation: PropTypes.string,
    badges: PropTypes.string,
    email: PropTypes.string,
    name: PropTypes.string,
    surnames: PropTypes.string,
    birthday: PropTypes.string,
    gender: PropTypes.string,
  }),
  badges: PropTypes.arrayOf(PropTypes.string),
  opened: PropTypes.bool,
  onClose: PropTypes.func,
};
