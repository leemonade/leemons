import PropTypes from 'prop-types';

export const TOTAL_LAYOUT_STEP_CONTAINER_WITH_ACCORDION_PROPS = {
  accordion: PropTypes.shape({
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    icon: PropTypes.node,
  }),
  noHorizontalPadding: PropTypes.bool,
  noVerticalPadding: PropTypes.bool,
  children: PropTypes.node.isRequired,
};
