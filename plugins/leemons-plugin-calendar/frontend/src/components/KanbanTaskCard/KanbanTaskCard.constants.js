import propTypes from 'prop-types';

export const emptyPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const KANBAN_TASK_CARD_DEFAULT_PROPS = {
  onClick: () => {},
  value: {},
  config: {},
  labels: {},
};
export const KANBAN_TASK_CARD_PROP_TYPES = {
  onClick: propTypes.func,
  value: propTypes.object,
  config: propTypes.object,
  labels: propTypes.object,
};
