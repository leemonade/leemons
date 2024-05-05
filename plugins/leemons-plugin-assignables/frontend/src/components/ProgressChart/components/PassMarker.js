import React from 'react';
import PropTypes from 'prop-types';
import { EdgeTriangles } from './EdgeTriangles';

const PassMarker = ({ yScale, width, passValue }) => {
  const y = yScale(passValue);
  const leftOffset = 0;
  const rightOffset = 36;
  const markHeight = 4;
  return (
    <g>
      <line
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke="#A3A3A3"
        strokeWidth={1.5}
        strokeDasharray={4}
      />
      <EdgeTriangles
        y={y}
        width={width}
        rightOffset={rightOffset}
        leftOffset={leftOffset}
        markHeight={markHeight}
        color="#A3A3A3"
      />
    </g>
  );
};

PassMarker.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.object),
  yScale: PropTypes.func,
  width: PropTypes.number,
  passValue: PropTypes.number,
};

export { PassMarker };
