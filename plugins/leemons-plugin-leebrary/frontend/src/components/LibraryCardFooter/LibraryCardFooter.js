import React from 'react';
import { capitalize, isFunction } from 'lodash';
import { AvatarsGroup, Box, Button, FileIcon, Text } from '@bubbles-ui/components';
import { LibraryCardFooterStyles } from './LibraryCardFooter.styles';
import {
  LIBRARY_CARD_FOOTER_DEFAULT_PROPS,
  LIBRARY_CARD_FOOTER_PROP_TYPES,
} from './LibraryCardFooter.constants';

const LibraryCardFooter = ({
  fileType,
  fileExtension,
  created,
  canAccess,
  classesCanAccess,
  action,
  onAction,
  locale,
  className,
  style,
  variant,
  variantTitle,
  variantIcon,
  ...props
}) => {
  const { classes, cx } = LibraryCardFooterStyles(
    { action, size: 12, color: '#636D7D' },
    { name: 'LibraryCardFooter' }
  );

  const formatDate = () => {
    try {
      return new Date(created).toLocaleDateString(locale);
    } catch (e) {
      return new Date(2010, 8, 21).toLocaleDateString(locale);
    }
  };

  const handleOnAction = () => {
    isFunction(onAction) && onAction();
  };

  // let component;
  // if (action) {
  //   component = (
  //     <Button variant={'link'} onClick={handleOnAction} size={'xs'}>
  //       {action}
  //     </Button>
  //   );
  // } else if (variantIcon) {
  //   const label =
  //     (variantTitle ?? fileType ?? variant)?.charAt(0)?.toUpperCase() +
  //     (variantTitle ?? fileType ?? variant)?.slice(1);
  // component = (
  //   <Box className={classes.FileIconRoot}>
  //     {variantIcon}
  //     {label && <Text className={classes.FileIconLabel}>{label}</Text>}
  //   </Box>
  // );
  // }
  //  else {
  //   component = (
  //     <FileIcon
  //       size={12}
  //       fileType={fileType || variant}
  //       fileExtension={fileExtension}
  //       color={'#636D7D'}
  //       label={
  //         (variantTitle ?? fileType ?? variant)?.charAt(0)?.toUpperCase() +
  //         (variantTitle ?? fileType ?? variant)?.slice(1)
  //       }
  //       hideExtension
  //     />
  //   );
  // }

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
          <FileIcon
            size={12}
            fileType={fileType || variant}
            fileExtension={fileExtension}
            color={'#636D7D'}
            label={
              (variantTitle ?? fileType ?? variant)?.charAt(0)?.toUpperCase() +
              (variantTitle ?? fileType ?? variant)?.slice(1)
            }
            hideExtension
          />

          {created ? (
            <Text role="productive" className={classes.date}>
              {formatDate()}
            </Text>
          ) : (
            <Box sx={(theme) => ({ paddingRight: theme.spacing[2] })}>
              <AvatarsGroup
                size="sm"
                data={canAccess}
                moreThanUsersAsMulti={2}
                classesData={classesCanAccess}
                zIndexInverted
                numberFromClassesAndData
                customAvatarMargin={4}
                limit={3}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

LibraryCardFooter.propTypes = LIBRARY_CARD_FOOTER_PROP_TYPES;

export { LibraryCardFooter };
