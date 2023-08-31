import PropTypes from 'prop-types';

export const SCORES_CELL_DEFAULT_PROPS = {};
export const SCORES_CELL_PROP_TYPES = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  noActivity: PropTypes.string,
  grades: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number,
      letter: PropTypes.string,
    })
  ),
};
