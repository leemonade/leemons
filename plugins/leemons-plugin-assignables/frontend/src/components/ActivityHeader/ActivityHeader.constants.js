import propTypes from 'prop-types';

export const ACTIVIY_HEADER_DEFAULT_PROPS = {};

export const ACTIVIY_HEADER_PROP_TYPES = {
  instance: propTypes.object,
  action: propTypes.string,
  showClass: propTypes.bool,
  showRole: propTypes.bool,
  showEvaluationType: propTypes.bool,
  showTime: propTypes.bool,
  showDeadline: propTypes.bool,
  showCloseButtons: propTypes.bool,
  allowEditDeadline: propTypes.bool,
};
