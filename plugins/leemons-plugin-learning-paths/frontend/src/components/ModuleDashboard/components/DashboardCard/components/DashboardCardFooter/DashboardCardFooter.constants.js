import propTypes from 'prop-types';

export const DASHBOARD_CARD_FOOTER_PROP_TYPES = {
  isBlocked: propTypes.bool,
  activity: propTypes.object,
  assignation: propTypes.object,
  localizations: propTypes.object,
  preview: propTypes.bool,
  role: propTypes.string,
  roleDetails: propTypes.object,
  rolesLocalizations: propTypes.object,
  buttonLink: propTypes.string,
  evaluationInfo: propTypes.object,
};

export const DASHBOARD_CARD_FOOTER_DEFAULT_PROPS = {
  isBlocked: false,
  activity: {},
  assignation: {},
  localizations: {},
  preview: false,
  role: '',
  roleDetails: {},
  rolesLocalizations: {},
  buttonLink: '',
  evaluationInfo: {},
};
