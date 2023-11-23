import PropTypes from 'prop-types';

export const CLASSROOMTITEMSDISPLAY_PROP_TYPES = {
  classroomIds: PropTypes.arrayOf(PropTypes.string) || PropTypes.object,
};
export const CLASSROOMTITEMSDISPLAY_DEFAULT_PROPS = {
  classroomIds: [],
};
