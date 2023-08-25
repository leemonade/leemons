import PropTypes from 'prop-types';

export const EVENT_DETAIL_PANEL_DEFAULT_PROPS = {
  labels: {
    attendanceControl: '',
    mainTeacher: '',
  },
};
export const EVENT_DETAIL_PANEL_PROP_TYPES = {
  opened: PropTypes.bool,
  event: PropTypes.shape({
    title: PropTypes.string,
    period: PropTypes.string,
    classGroup: PropTypes.string,
    subject: PropTypes.shape({
      name: PropTypes.string,
      icon: PropTypes.string,
    }),
    teacher: PropTypes.shape({
      image: PropTypes.string,
      name: PropTypes.string,
      surnames: PropTypes.string,
    }),
    classroom: PropTypes.string,
    location: PropTypes.string,
  }),
  labels: PropTypes.shape({
    attendanceControl: PropTypes.string,
  }),
  locale: PropTypes.string,
  onClose: PropTypes.func,
};
