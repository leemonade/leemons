/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { AvatarsGroup, Box, FileIcon, Text } from '@bubbles-ui/components';
import { NYACardFooterStyles } from './NYACardFooter.styles';
import { NYACARD_FOOTER_PROP_TYPES } from './NYACardFooter.constants';

const NYACardFooter = ({
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
}) => {
  const { classes, cx } = NYACardFooterStyles(
    { action, size: 12, color: '#636D7D' },
    { name: 'NYACardFooter' }
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
            size={24}
            fileType={fileType || variant}
            fileExtension={fileExtension}
            color={'#878D96'}
            hideExtension
          />
          <Text className={classes.fileLabel}>{variantIconLabel}</Text>
        </Box>
      )}

      <Box className={classes.avatars}>
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
      </Box>
    </Box>
  );
};

NYACardFooter.propTypes = NYACARD_FOOTER_PROP_TYPES;

export { NYACardFooter };
export default NYACardFooter;
