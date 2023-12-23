import propTypes from 'prop-types';

export const METADATA_DISPLAY_PROP_TYPES = {
  metadata: propTypes.object,
  onCopy: propTypes.func,
};

export const METADATA_DISPLAY_DEFAULT_PROPS = {
  metadata: null,
  onCopy: () => {},
};
