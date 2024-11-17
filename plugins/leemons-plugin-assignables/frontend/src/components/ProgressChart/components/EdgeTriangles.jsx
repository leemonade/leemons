import React from 'react';
import PropTypes from 'prop-types';

function EdgeTriangles({ y, width, rightOffset, leftOffset, markHeight, color }) {
  return (
    <>
      <polygon
        points={`${leftOffset},${y} ${leftOffset - 6},${y - markHeight} ${leftOffset - 6},${
          y + markHeight
        }`}
        fill={color}
      />
      <polygon
        points={`${width - rightOffset},${y} ${width + 6 - rightOffset},${y - markHeight} ${
          width + 6 - rightOffset
        },${y + markHeight}`}
        fill={color}
      />
    </>
  );
}

EdgeTriangles.propTypes = {
  y: PropTypes.number,
  width: PropTypes.number,
  leftOffset: PropTypes.number,
  rightOffset: PropTypes.number,
  markHeight: PropTypes.number,
  color: PropTypes.string,
};

export { EdgeTriangles };
