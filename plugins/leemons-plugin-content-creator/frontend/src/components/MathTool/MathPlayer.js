import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Box } from '@bubbles-ui/components';
import { NodeViewWrapper } from '@bubbles-ui/editors';

export const MATH_PLAYER_DISPLAYS = ['card', 'player'];
export const MATH_PLAYER_ALIGNS = ['left', 'center', 'right'];

export const MATH_PLAYER_DEFAULT_PROPS = {
  node: {
    attrs: {
      asset: null,
      width: '100%',
      display: 'card',
      align: 'left',
    },
  },
};

export const MATH_PLAYER_PROP_TYPES = {
  node: PropTypes.shape({
    attrs: PropTypes.shape({
      asset: PropTypes.any,
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      display: PropTypes.oneOf(MATH_PLAYER_DISPLAYS),
      align: PropTypes.oneOf(MATH_PLAYER_ALIGNS),
      readOnly: PropTypes.bool,
      isFloating: PropTypes.bool,
    }),
  }),
};

const MathPlayer = ({
  node: {
    attrs: { asset, width, display, align, isFloating, readOnly },
  },
}) => {
  const selfRef = useRef({});
  const isWidthNum = /^\d+$/.test(width);
  const widthProp = isWidthNum ? `${width}px` : width;

  const getDisplay = () => {
    if (display === 'embed') {
      return <Box style={{ width: isFloating ? '100%' : widthProp }}>Input</Box>;
    }

    return <Box style={{ width: isFloating ? '100%' : widthProp, userSelect: 'none' }}>Input</Box>;
  };

  useEffect(() => {
    if (!selfRef.current || !selfRef.current.parentNode) return;
    const { parentNode } = selfRef.current;

    parentNode.style.maxWidth = isFloating ? width : '100%';
    parentNode.style.float = isFloating && (align === 'left' || 'right') ? align : 'none';
  }, [width, align, isFloating]);

  return (
    <NodeViewWrapper className="math-extension" data-drag-handle ref={selfRef}>
      {!asset || isEmpty(asset) ? (
        <div>No Asset found</div>
      ) : (
        <Box
          style={{
            display: !isFloating && 'flex',
            justifyContent: !isFloating && align,
            marginTop: !isFloating && 20,
            marginBottom: !isFloating && 20,
            marginLeft: ['left'].includes(align) ? 0 : 20,
            marginRight: ['right'].includes(align) ? 0 : 20,
          }}
        >
          {getDisplay()}
        </Box>
      )}
    </NodeViewWrapper>
  );
};

MathPlayer.propTypes = MATH_PLAYER_PROP_TYPES;
MathPlayer.defaultProps = MATH_PLAYER_DEFAULT_PROPS;

export { MathPlayer };
