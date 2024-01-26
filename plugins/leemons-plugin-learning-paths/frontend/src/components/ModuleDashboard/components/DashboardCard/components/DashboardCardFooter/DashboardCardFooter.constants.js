import propTypes from 'prop-types';

export const DASHBOARD_CARD_FOOTER_PROP_TYPES = {
  isBlocked: propTypes.bool,
  activity: propTypes.shape({
    requiresScoring: propTypes.bool,
  }),
  assignation: propTypes.object,
  localizations: propTypes.shape({
    buttons: propTypes.shape({
      review: propTypes.string,
    }),
  }),
  preview: propTypes.bool,
  role: propTypes.string,
  roleDetails: propTypes.object,
  rolesLocalizations: propTypes.object,
  buttonLink: propTypes.string,
  evaluationInfo: propTypes.shape({
    state: propTypes.string,
  }),
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
