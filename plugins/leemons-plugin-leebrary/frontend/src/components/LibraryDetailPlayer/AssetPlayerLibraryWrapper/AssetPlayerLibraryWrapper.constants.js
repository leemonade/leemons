import propTypes from 'prop-types';

export const ASSET_PLAYER_LIBRARY_WRAPPER_PROP_TYPES = {
  asset: propTypes.object,
  viewPDF: propTypes.bool,
  detailMode: propTypes.bool,
  category: propTypes.object,
};
export const ASSET_PLAYER_LIBRARY_WRAPPER_DEFAULT_PROPS = {
  asset: {},
  viewPDF: false,
  detailMode: false,
  category: {},
};
