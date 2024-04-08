import propTypes from 'prop-types';

export const ACTIVITY_HEADER_DEFAULT_PROPS = {};

export const ACTIVITY_HEADER_PROP_TYPES = {
  instance: propTypes.object,
  action: propTypes.string,
  showClass: propTypes.bool,
  showRole: propTypes.bool,
  showEvaluationType: propTypes.bool,
  showStartDate: propTypes.bool,
  showTime: propTypes.bool,
  showCountdown: propTypes.bool,
  showDeadline: propTypes.bool,
  showCloseButtons: propTypes.bool,
  allowEditDeadline: propTypes.bool,
  onTimeout: propTypes.func,
  showStatusBadge: propTypes.bool,
};
