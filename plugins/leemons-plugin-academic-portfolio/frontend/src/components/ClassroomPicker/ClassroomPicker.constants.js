import propTypes from 'prop-types';

export const CLASSROOM_PICKER_PROP_TYPES = {
  programId: propTypes.string,
  value: propTypes.any,
  allowCollisions: propTypes.bool,
  error: propTypes.string,
  onChange: propTypes.func,
  data: propTypes.array,
};

export const CLASSROOM_PICKER_DEFAULT_PROPS = {
  programId: '',
  value: [],
  data: null,
  allowCollisions: false,
};
