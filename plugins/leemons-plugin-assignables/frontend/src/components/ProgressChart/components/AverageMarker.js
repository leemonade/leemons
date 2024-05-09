import React from 'react';
import PropTypes from 'prop-types';
import { EdgeTriangles } from './EdgeTriangles';

const AverageMarker = ({ bars = [], yScale, width, roundValues }) => {
  const valueBars = bars
    .filter((bar) => bar.data.id !== 'diff' && !bar.data.indexValue.startsWith('skip:'))
    .filter((bar) => bar.data.value);

  if (!valueBars.length) return null;

  const avgValue = valueBars.reduce((total, bar) => total + bar.data.value, 0) / valueBars.length;

  const y = yScale(roundValues ? Math.round(avgValue) : avgValue);
  const leftOffset = 0;
  const rightOffset = 36;
  const markHeight = 4;
  return (
    <g>
      <line x1={0} y1={y} x2={width} y2={y} stroke="#BA73B4" strokeWidth={1.5} />
      <EdgeTriangles
        y={y}
        width={width}
        rightOffset={rightOffset}
        leftOffset={leftOffset}
        markHeight={markHeight}
        color="#BA73B4"
      />
    </g>
  );
};

AverageMarker.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.object),
  yScale: PropTypes.func,
  width: PropTypes.number,
  roundValues: PropTypes.bool,
};

export { AverageMarker };
