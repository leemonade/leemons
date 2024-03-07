import React from 'react';
import PropTypes from 'prop-types';
import { Motion, spring, presets } from 'react-motion';
import { Box } from '@bubbles-ui/components';

function useAnimatedPaneStyles({ variant, reversed, width, gap }) {
  const fullOpacity = 1;
  const hiddenOpacity = 0;
  const mediumOpacity = 0.6;

  switch (variant) {
    case 'primaryPane':
      return {
        zIndex: 0,
        initialStyle: { translateX: 0, opacity: fullOpacity },
        endingStyle: reversed
          ? {
              translateX: spring(width + gap, presets.noWobble),
              opacity: spring(hiddenOpacity, presets.noWobble),
            }
          : {
              translateX: spring(-(width + gap), presets.noWobble),
              opacity: spring(hiddenOpacity, presets.noWobble),
            },
      };
    case 'secondaryPane':
      return reversed
        ? {
            zIndex: 1,
            initialStyle: {
              translateX: -(width + gap),
              opacity: hiddenOpacity,
            },
            endingStyle: {
              translateX: spring(0, presets.noWobble),
              opacity: spring(fullOpacity, presets.noWobble),
            },
          }
        : {
            zIndex: -1,
            initialStyle: {
              translateX: width + gap,
              opacity: hiddenOpacity,
            },
            endingStyle: {
              translateX: spring(0, presets.noWobble),
              opacity: spring(fullOpacity, presets.noWobble),
            },
          };
    default:
      return {
        initialStyle: {},
        endingStyle: {},
      };
  }
}
export function AnimatedPane({
  children,
  width,
  gap,
  animating,
  variant,
  reversed,
  onAnimationEnd,
}) {
  const { zIndex, initialStyle, endingStyle } = useAnimatedPaneStyles({
    variant,
    width,
    gap,
    reversed,
  });

  return (
    <Motion
      defaultStyle={initialStyle}
      style={animating ? endingStyle : initialStyle}
      onRest={() => animating && onAnimationEnd?.()}
    >
      {(interpolatingStyle) => {
        const element = React.cloneElement(children, {
          style: interpolatingStyle,
        });

        return (
          <Box sx={{ position: 'absolute', zIndex, height: '100%', width: '100%' }}>{element}</Box>
        );
      }}
    </Motion>
  );
}
AnimatedPane.propTypes = {
  children: PropTypes.node,
  width: PropTypes.number,
  gap: PropTypes.number,
  animating: PropTypes.bool,
  reversed: PropTypes.bool,
  variant: PropTypes.oneOf(['primaryPane', 'secondaryPane']),
  onAnimationEnd: PropTypes.func,
};
