import React from 'react';
import PropTypes from 'prop-types';

function Bar({ bar: { x, y, width, height, color, data } }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect width={width} height={height} fill={color} />
      {data.id !== 'diff' && (
        <text x={width / 2} y={height / 2} textAnchor="middle" dominantBaseline={'central'}>
          {data.data.value}
        </text>
      )}
    </g>
  );
}

Bar.propTypes = {
  bar: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
  }).isRequired,
};

export { Bar };
