/* eslint-disable no-unsafe-optional-chaining */
import React from 'react';

import { AvatarsGroup, Box, FileIcon, Text } from '@bubbles-ui/components';

import { LIBRARY_CARD_FOOTER_PROP_TYPES } from './LibraryCardFooter.constants';
import { LibraryCardFooterStyles } from './LibraryCardFooter.styles';

const LibraryCardFooter = ({
  fileType,
  fileExtension,
  canAccess,
  classesCanAccess,
  action,
  className,
  style,
  variant,
  variantTitle,
  variantIcon,
  autoHeight,
  hideCanAccess,
}) => {
  const { classes, cx } = LibraryCardFooterStyles(
    { action, size: 12, autoHeight },
    { name: 'LibraryCardFooter' }
  );

  const variantIconLabel =
    (variantTitle ?? fileType ?? variant)?.charAt(0)?.toUpperCase() +
    (variantTitle ?? fileType ?? variant)?.slice(1);

  return (
    <Box className={cx(classes.root, className)} style={style}>
      {!action && variantIcon ? (
        <Box className={classes.FileIconRoot}>
          {variantIcon}
          {variantIconLabel && <Text className={classes.FileIconLabel}>{variantIconLabel}</Text>}
        </Box>
      ) : (
        <Box className={classes.fileIconContainer}>
          <FileIcon
            size={18}
            fileType={fileType === 'file' ? fileExtension : fileType || variant}
            fileExtension={fileExtension}
            color={'#878D96'}
            hideExtension
          />
          <Text className={classes.fileLabel}>
            {fileType === 'file' ? fileExtension?.toUpperCase() : variantIconLabel}
          </Text>
        </Box>
      )}

      <Box className={classes.avatars}>
        {!hideCanAccess && (
          <AvatarsGroup
            size="sm"
            data={canAccess}
            moreThanUsersAsMulti={2}
            classesData={classesCanAccess}
            numberFromClassesAndData
            customAvatarMargin={14}
            limit={2}
            zIndexInverted={true}
          />
        )}
      </Box>
    </Box>
  );
};

LibraryCardFooter.propTypes = LIBRARY_CARD_FOOTER_PROP_TYPES;

export { LibraryCardFooter };
export default LibraryCardFooter;
