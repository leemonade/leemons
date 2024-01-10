import propTypes from 'prop-types';

export const DASHBOARD_CARD_COVER_PROP_TYPES = {
  asset: propTypes.object,
  assetNumber: propTypes.number,
  assignation: propTypes.object,
  moduleColor: propTypes.string,
  evaluationInfo: propTypes.object,
};

export const DASHBOARD_CARD_COVER_DEFAULT_PROPS = {
  asset: {},
  assetNumber: 0,
  assignation: {},
  moduleColor: '',
  evaluationInfo: {},
};
