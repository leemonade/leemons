import PropTypes from 'prop-types';

export const NYACARD_BODY_DEFAULT_PROPS = {
  metadata: [],
  tags: [],
  variant: 'media',
  badgeColor: 'solid',
  truncated: true,
  locale: 'en-GB',
  fullHeight: false,
  role: 'teacher',
  isNew: false,
  localizations: {},
  isTeacherSyllabus: false,
};
export const NYACARD_BODY_PROP_TYPES = {
  tagline: PropTypes.string,
  description: PropTypes.string,
  metadata: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.any, value: PropTypes.any })),
  tags: PropTypes.arrayOf(PropTypes.string),
  locale: PropTypes.string,
  isTeacherSyllabus: PropTypes.bool,
  // variant: PropTypes.oneOf(LIBRARYCARD_VARIANTS),
  // assigment: PropTypes.shape(LIBRARYCARD_ASSIGMENT),
  truncated: PropTypes.bool,
  fullHeight: PropTypes.bool,
  isNew: PropTypes.bool,
  localizations: PropTypes.shape({}),
  // role: PropTypes.oneOf(LIBRARYCARD_ASSIGMENT_ROLES),
};
