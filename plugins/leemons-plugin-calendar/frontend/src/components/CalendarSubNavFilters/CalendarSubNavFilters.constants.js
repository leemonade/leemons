import PropTypes from 'prop-types';

export const CALENDAR_SUB_NAV_FILTERS_DEFAULT_PROPS = {
  messages: {
    title: 'Calendar',
    centers: 'Centers',
    closeTooltip: 'Close',
  },
  pages: [
    { label: 'Calendar', value: 'calendar' },
    { label: 'Schedule', value: 'schedule' },
  ],
  centers: [],
  onChange: () => {},
  centerOnChange: () => {},
  pageOnChange: () => {},
  onClose: () => {},
  showPageControl: false,
  mainColor: '#212B3D',
  drawerColor: '#333F56',
  lightMode: false,
};
export const CALENDAR_SUB_NAV_FILTERS_PROP_TYPES = {
  messages: PropTypes.object,
  pages: PropTypes.array,
  centers: PropTypes.array,
  onChange: PropTypes.func,
  centerOnChange: PropTypes.func,
  pageOnChange: PropTypes.func,
  onClose: PropTypes.func,
  value: PropTypes.array,
  pageValue: PropTypes.array,
  centerValue: PropTypes.string,
  showPageControl: PropTypes.bool,
  mainColor: PropTypes.string,
  drawerColor: PropTypes.string,
  lightMode: PropTypes.bool,
};
