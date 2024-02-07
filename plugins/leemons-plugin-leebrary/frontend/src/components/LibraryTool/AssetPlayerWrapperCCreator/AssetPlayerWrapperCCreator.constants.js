import propTypes from 'prop-types';

export const ASSET_PLAYER_WRAPPER_CCREATOR_DEFAULT_PROPS = {
  asset: {},
  isFloating: false,
  width: '',
  readOnly: false,
};

export const ASSET_PLAYER_WRAPPER_CCREATOR_PROP_TYPES = {
  asset: propTypes.object,
  isFloating: propTypes.bool,
  width: propTypes.string,
  readOnly: propTypes.bool,
};
