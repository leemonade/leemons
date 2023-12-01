import PropTypes from 'prop-types';

export const ROOMITEMDISPLAY_PROP_TYPES = {
  chatKeys: PropTypes.arrayOf(PropTypes.string) || PropTypes.number,
};

export const ROOMITEMDISPLAY_DEFAULT_PROPS = {
  chatKeys: [],
};
