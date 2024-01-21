import PropTypes from 'prop-types';

export const PDF_PLAYER_DEFAULT_PROPS = {
  labels: {
    pageLabel: '',
    paginatorLabel: '',
  },
  useSchema: true,
};
export const PDF_PLAYER_PROP_TYPES = {
  labels: PropTypes.shape({
    pageLabel: PropTypes.string,
    paginatorLabel: PropTypes.string,
  }),
  useSchema: PropTypes.bool,
};
