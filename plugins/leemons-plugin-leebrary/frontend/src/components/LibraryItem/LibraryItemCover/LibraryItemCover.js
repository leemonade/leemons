import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { Box, ImageLoader, COLORS } from '@bubbles-ui/components';
import { LibraryItemCoverStyles } from './LibraryItemCover.styles';
import { getSize } from '../LibraryItem.constants';

const LibraryItemCover = ({ size, cover, color, fileIcon }) => {
  const { height } = getSize(size);

  const icon = useMemo(
    () =>
      !isNil(fileIcon)
        ? React.cloneElement(fileIcon, {
            size: !cover ? Math.round(height / 2.2) : Math.round(height / 3),
            color: !color ? COLORS.text03 : COLORS.mainWhite,
            iconStyle: { backgroundColor: color || COLORS.interactive03h },
          })
        : null,
    [fileIcon]
  );
  const { classes } = LibraryItemCoverStyles({ size, color, cover }, { name: 'LibraryItemCover' });

  return (
    <Box className={classes.root}>
      {cover && <ImageLoader src={cover} height={height} forceImage />}
      <Box className={classes.fileIcon}>{icon}</Box>
    </Box>
  );
};

LibraryItemCover.defaultProps = {
  size: 'sm',
};
LibraryItemCover.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export { LibraryItemCover };
