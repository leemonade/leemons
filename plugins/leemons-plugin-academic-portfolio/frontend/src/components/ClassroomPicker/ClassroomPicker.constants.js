import propTypes from 'prop-types';

export const CLASSROOM_PICKER_PROP_TYPES = {
  programId: propTypes.string,
  data: propTypes.arrayOf(propTypes.object),
  allowCollisions: propTypes.bool,
};

export const CLASSROOM_PICKER_DEFAULT_PROPS = {
  programId: '',
  data: [],
  allowCollisions: false,
};
