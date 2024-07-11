import React, { useMemo } from 'react';
import { Box, COLORS, CardEmptyCover } from '@bubbles-ui/components';
import { isNil } from 'lodash';
import { ButtonIcon } from '@leebrary/components/AssetPlayer/components/ButtonIcon';
import Cover from '@leebrary/components/Cover';
import { LibraryCardCCCoverStyles } from './LibraryCardCCCover.styles';
import {
  LIBRARY_CARD_CC_COVER_PROPTYPES,
  LIBRARY_CARD_CC_COVER_DEFAULTPROPS,
} from './LibraryCardCCCover.constants';

const LibraryCardCCCover = ({
  cover,
  color,
  fileIcon,
  subject,
  fileType,
  fileExtension,
  variantIcon,
}) => {
  const { classes } = LibraryCardCCCoverStyles(
    { color, subjectColor: subject?.color },
    { name: 'LibraryCardCCCover' }
  );

  const buttonIconByFileType = {
    [`${fileType === 'bookmark'}`]: 'document',
    [`${fileType === 'document' && fileExtension === 'pdf'}`]: 'document',
    [`${
      (fileType === 'document' && fileExtension !== 'pdf') ||
      fileType === 'file' ||
      fileType === 'application'
    }`]: 'file',
  };

  const icon = useMemo(
    () =>
      !isNil(fileIcon)
        ? React.cloneElement(fileIcon, { iconStyle: { backgroundColor: COLORS.interactive03h } })
        : null,
    [fileIcon]
  );

  const heightAndSubjectColor = color ? 144 : 144 + 6;

  const MemoizedEmptyCover = useMemo(
    () => <CardEmptyCover icon={variantIcon ?? icon} fileType={fileType} />,
    [icon, variantIcon, fileType]
  );
  return (
    <Box className={classes.root}>
      {color && <Box className={classes.color} />}
      <Box className={classes.overlayTransparent}></Box>
      {cover ? <Cover height={heightAndSubjectColor} asset={{ cover }} /> : MemoizedEmptyCover}
      <Box className={classes.buttonIcon}>
        <ButtonIcon fileType={buttonIconByFileType.true} />
      </Box>
    </Box>
  );
};

LibraryCardCCCover.propTypes = LIBRARY_CARD_CC_COVER_PROPTYPES;
LibraryCardCCCover.defaultProps = LIBRARY_CARD_CC_COVER_DEFAULTPROPS;

export default LibraryCardCCCover;
