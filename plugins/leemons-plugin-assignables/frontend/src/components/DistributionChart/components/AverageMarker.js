import React from 'react';
import PropTypes from 'prop-types';
import { sum } from 'lodash';
import { EdgeTriangles } from './EdgeTriangles';

const AverageMarker = ({ bars = [], xScale, innerHeight, barWidth }) => {
  const valueBars = bars.filter(
    (bar) => bar.data.id !== 'diff' && !String(bar.data.indexValue).startsWith('skip:')
  );

  if (!valueBars.length) return null;

  const accValues = valueBars.reduce((total, bar) => {
    total.push(...Array.from({ length: bar.data.value }, () => Number(bar.data.indexValue)));
    return total;
  }, []);
  const avgValue = sum(accValues) / accValues.length;

  if (!accValues.length) return null;

  const x = xScale(Math.round(avgValue));
  const markWidth = 4;
  return (
    <g transform={`translate(${barWidth / 2}, 0)`}>
      <line x1={x} y1={0} x2={x} y2={innerHeight} stroke="#BA73B4" strokeWidth={1.5} />
      <EdgeTriangles x={x} height={innerHeight} markWidth={markWidth} color="#BA73B4" />
    </g>
  );
};

AverageMarker.propTypes = {
  bars: PropTypes.arrayOf(PropTypes.object),
  xScale: PropTypes.func,
  innerHeight: PropTypes.number,
  barWidth: PropTypes.number,
};

export { AverageMarker };
