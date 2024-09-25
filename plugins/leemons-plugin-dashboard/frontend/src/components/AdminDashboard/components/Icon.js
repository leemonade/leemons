import React from 'react';
import PropTypes from 'prop-types';
import { Box, ImageLoader } from '@bubbles-ui/components';

function Icon({ size = '23px', className, src }) {
  return (
    <Box
      style={{
        position: 'relative',
        width: size,
        height: size,
      }}
    >
      <ImageLoader className={className} src={src} />
    </Box>
  );
}

Icon.propTypes = {
  src: PropTypes.string,
  className: PropTypes.string,
  size: PropTypes.string,
};

export { Icon };
