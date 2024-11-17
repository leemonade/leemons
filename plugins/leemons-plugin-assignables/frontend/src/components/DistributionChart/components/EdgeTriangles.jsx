import React from 'react';
import PropTypes from 'prop-types';

function EdgeTriangles({ x, height, topOffset = 6, bottomOffset = 6, markWidth = 6, color }) {
  return (
    <>
      <polygon
        points={`${x},${topOffset} ${x - markWidth},${topOffset - 6} ${x + markWidth},${
          topOffset - 6
        }`}
        fill={color}
      />
      <polygon
        points={`${x},${height - bottomOffset} ${x - markWidth},${height + 6 - bottomOffset} ${
          x + markWidth
        },${height + 6 - bottomOffset}`}
        fill={color}
      />
    </>
  );
}

EdgeTriangles.propTypes = {
  x: PropTypes.number,
  height: PropTypes.number,
  topOffset: PropTypes.number,
  bottomOffset: PropTypes.number,
  markWidth: PropTypes.number,
  color: PropTypes.string,
};

export { EdgeTriangles };
