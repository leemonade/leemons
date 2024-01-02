import PropTypes from 'prop-types';

export const SCOREFEEDBACK_PROP_TYPES = {
  score: PropTypes.number,
  program: PropTypes.object,
  instance: PropTypes.object,
  isFeedback: PropTypes.bool,
  totalActivities: PropTypes.number,
  submitedActivities: PropTypes.number,
};

export const SCOREFEEDBACK_DEFAULT_PROPS = {
  score: 0,
  program: {},
  instance: {},
  isFeedback: false,
  totalActivities: 0,
  submitedActivities: 0,
};
