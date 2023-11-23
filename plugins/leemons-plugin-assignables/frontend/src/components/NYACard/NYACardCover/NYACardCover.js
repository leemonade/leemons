import React, { useMemo } from 'react';
import { isNil } from 'lodash';
import { Box, COLORS, ImageLoader, CardEmptyCover } from '@bubbles-ui/components';
import { NYACardCoverStyles } from './NYACardCover.styles';
import { NYACARD_COVER_DEFAULT_PROPS, NYACARD_COVER_PROP_TYPES } from './NYACardCover.constants';

const NYACardCover = ({
  height,
  cover,
  fileIcon,
  parentHovered,
  fileType,
  variantIcon,
  variantTitle,
  topColor,
}) => {
  const { classes } = NYACardCoverStyles(
    { color: topColor, height, parentHovered },
    { name: 'NYACardCover' }
  );
  const icon = useMemo(
    () =>
      !isNil(fileIcon)
        ? React.cloneElement(fileIcon, { iconStyle: { backgroundColor: COLORS.interactive03h } })
        : null,
    [fileIcon]
  );

  const MemoizedEmptyCover = useMemo(
    () => <CardEmptyCover icon={icon || variantIcon} fileType={fileType || variantTitle} />,
    [icon, variantIcon, fileType]
  );

  return (
    <Box className={classes.root}>
      <Box className={classes.color} />
      <Box className={classes.overlayTransparent}></Box>
      {cover ? (
        <ImageLoader src={cover} height={height} width={'100%'} forceImage />
      ) : (
        MemoizedEmptyCover
      )}
    </Box>
  );
};

export { NYACardCover };
export default NYACardCover;
NYACardCover.defaultProps = NYACARD_COVER_DEFAULT_PROPS;
NYACardCover.propTypes = NYACARD_COVER_PROP_TYPES;
