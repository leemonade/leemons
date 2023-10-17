import PropTypes from 'prop-types';

export const SUBJECT_HEADER_DEFAULT_PROPS = {};
export const SUBJECT_HEADER_PROP_TYPES = {
  id: PropTypes.string,
  name: PropTypes.string,
  deadline: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]),
  completionPercentage: PropTypes.string,
  locale: PropTypes.string,
};
