/* eslint-disable import/prefer-default-export */
/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { Box, FileIcon, Text } from '@bubbles-ui/components';
import { VariantItemDisplayStyles } from './VariantItemDisplay.styles';
import {
  VARIANT_ITEM_DISPLAY_DEFAULT_PROPS,
  VARIANT_ITEM_DISPLAY_PROP_TYPES,
} from './VariantItemDisplay.constants';

const VariantItemDisplay = ({
  fileType,
  fileExtension,
  action,
  className,
  style,
  variant,
  variantTitle,
  variantIcon,
}) => {
  const { classes, cx } = VariantItemDisplayStyles(
    { action, size: 12, color: '#636D7D' },
    { name: 'LibraryCardFooter' }
  );

  const variantIconLabel =
    (variantTitle ?? fileType ?? variant)?.charAt(0)?.toUpperCase() +
    (variantTitle ?? fileType ?? variant)?.slice(1);

  return (
    <Box className={cx(classes.root, className)} style={style}>
      {!action && variantIcon ? (
        <Box className={classes.fileIconRoot}>
          {variantIcon}
          {variantIconLabel && <Text className={classes.fileIconLabel}>{variantIconLabel}</Text>}
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
      {/* 
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
      </Box> */}
    </Box>
  );
};

VariantItemDisplay.propTypes = VARIANT_ITEM_DISPLAY_PROP_TYPES;
VariantItemDisplay.defaultProps = VARIANT_ITEM_DISPLAY_DEFAULT_PROPS;
VariantItemDisplay.displayName = 'VariantItemDisplay';

export default VariantItemDisplay;
export { VariantItemDisplay };
