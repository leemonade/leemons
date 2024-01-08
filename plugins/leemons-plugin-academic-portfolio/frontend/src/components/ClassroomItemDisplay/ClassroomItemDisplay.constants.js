import PropTypes from 'prop-types';

export const CLASSROOMTITEMSDISPLAY_PROP_TYPES = {
  classroomIds: PropTypes.arrayOf(PropTypes.string) || PropTypes.object,
  isModule: PropTypes.bool,
  compact: PropTypes.bool,
};
export const CLASSROOMTITEMSDISPLAY_DEFAULT_PROPS = {
  classroomIds: [],
  isModule: false,
  compact: false,
};
