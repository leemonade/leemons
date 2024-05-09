import React from 'react';
import PropTypes from 'prop-types';
import { EdgeTriangles } from './EdgeTriangles';

const PassMarker = ({ xScale, innerHeight, passValue, barWidth }) => {
  const x = xScale(passValue);
  const markWidth = 4;
  return (
    <g transform={`translate(${barWidth / 2}, 0)`}>
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={innerHeight}
        stroke="#A3A3A3"
        strokeWidth={1.5}
        strokeDasharray={4}
      />
      <EdgeTriangles x={x} height={innerHeight} markWidth={markWidth} color="#A3A3A3" />
    </g>
  );
};

PassMarker.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.object),
  xScale: PropTypes.func,
  width: PropTypes.number,
  innerHeight: PropTypes.number,
  passValue: PropTypes.number,
  barWidth: PropTypes.number,
};

export { PassMarker };
