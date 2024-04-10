import propTypes from 'prop-types';

export const NODE_RENDERER_PROP_TYPES = {
  node: propTypes.object.isRequired,
  depth: propTypes.number.isRequired,
  isOpen: propTypes.bool.isRequired,
  onToggle: propTypes.func.isRequired,
  isActive: propTypes.bool.isRequired,
  handleNodeClick: propTypes.func.isRequired,
};

export const NODE_RENDERER_DEFAULT_PROPS = {
  node: {},
  depth: 0,
  isOpen: false,
  onToggle: () => {},
  isActive: false,
  handleNodeClick: () => {},
};
