import PropTypes from 'prop-types';

export const EVALUATIONCARD_DEFAULT_PROPS = {
  instance: {},
  variantTitle: '',
  variantIcon: '',
  localizations: {},
  isHovered: false,
};

export const EVALUATIONCARD_PROP_TYPES = {
  instance: PropTypes.object,
  variantTitle: PropTypes.string,
  variantIcon: PropTypes.element,
  localizations: PropTypes.object,
  isHovered: PropTypes.bool,
};
