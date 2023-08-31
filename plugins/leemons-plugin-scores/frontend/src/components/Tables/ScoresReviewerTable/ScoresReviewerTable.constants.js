import PropTypes from 'prop-types';

export const SCORES_REVIEWER_TABLE_VALUE = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
  surname: PropTypes.string,
  image: PropTypes.string,
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      score: PropTypes.number,
      isSubmitted: PropTypes.bool,
    })
  ),
  customScore: PropTypes.number,
  allowCustomChange: PropTypes.bool,
});

export const SCORES_REVIEWER_TABLE_DEFAULT_PROPS = {
  value: [],
  hideCustom: false,
};
export const SCORES_REVIEWER_TABLE_PROP_TYPES = {
  grades: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number,
      letter: PropTypes.string,
    })
  ),
  subjects: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      group: PropTypes.string,
      color: PropTypes.string,
      icon: PropTypes.string,
      periods: PropTypes.array,
    })
  ),
  value: PropTypes.arrayOf(SCORES_REVIEWER_TABLE_VALUE),
  labels: PropTypes.shape({
    students: PropTypes.string,
    noActivity: PropTypes.string,
    avgScore: PropTypes.string,
    gradingTasks: PropTypes.string,
    customScore: PropTypes.string,
  }),
  hideCustom: PropTypes.bool,
};
