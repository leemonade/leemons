/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { isFunction } from 'lodash';
import { AvatarsGroup, Box, Button, FileIcon, Text } from '@bubbles-ui/components';
import { LibraryCardFooterStyles } from './LibraryCardFooter.styles';
import { LIBRARY_CARD_FOOTER_PROP_TYPES } from './LibraryCardFooter.constants';

const LibraryCardFooter = ({
  fileType,
  fileExtension,
  canAccess,
  classesCanAccess,
  action,
  onAction,
  className,
  style,
  variant,
  variantTitle,
  variantIcon,
}) => {
  const { classes, cx } = LibraryCardFooterStyles(
    { action, size: 12, color: '#636D7D' },
    { name: 'LibraryCardFooter' }
  );

  const handleOnAction = () => {
    if (isFunction(onAction)) return onAction();
    return null;
  };

  const variantIconLabel =
    (variantTitle ?? fileType ?? variant)?.charAt(0)?.toUpperCase() +
    (variantTitle ?? fileType ?? variant)?.slice(1);

  return (
    <Box className={cx(classes.root, className)} style={style}>
      {action && !variantIcon ? (
        <Button variant={'link'} onClick={() => handleOnAction()} size={'xs'}>
          {action}
        </Button>
      ) : !action && variantIcon ? (
        <Box className={classes.FileIconRoot}>
          {variantIcon}
          {variantIconLabel && <Text className={classes.FileIconLabel}>{variantIconLabel}</Text>}
        </Box>
      ) : (
        <>
          <Box className={classes.fileIconContainer}>
            <FileIcon
              size={24}
              fileType={fileType || variant}
              fileExtension={fileExtension}
              color={'#878D96'}
              hideExtension
            />
            <Text className={classes.fileLabel}>{variantIconLabel}</Text>
          </Box>
          <Box>
            <AvatarsGroup
              size="sm"
              data={canAccess}
              moreThanUsersAsMulti={2}
              classesData={classesCanAccess}
              numberFromClassesAndData
              customAvatarMargin={14}
              limit={3}
            />
          </Box>
        </>
      )}
    </Box>
  );
};

LibraryCardFooter.propTypes = LIBRARY_CARD_FOOTER_PROP_TYPES;

export { LibraryCardFooter };
export default LibraryCardFooter;
