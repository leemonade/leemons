import PropTypes from 'prop-types';

export const SUBJECTITEMSDISPLAY_PROP_TYPES = {
  subjectsIds: PropTypes.arrayOf(PropTypes.string) || PropTypes.object,
  programId: PropTypes.string,
};
export const SUBJECTITEMSDISPLAY_DEFAULT_PROPS = {
  subjectsIds: [],
  programId: '',
};
