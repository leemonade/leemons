import React, { useCallback } from 'react';
import { isFunction } from 'lodash';
import { Box, ImageLoader, Text } from '@bubbles-ui/components';
import { LibraryNavbarItemStyles } from './LibraryNavbarItem.styles';
import {
  LIBRARY_NAVBAR_ITEM_DEFAULT_PROPS,
  LIBRARY_NAVBAR_ITEM_PROP_TYPES
} from './LibraryNavbarItem.constants';
import { ChevUpIcon } from '@bubbles-ui/icons/outline';

const LibraryNavbarItem = ({
                             icon,
                             label,
                             canOpen,
                             opened,
                             selected,
                             disabled,
                             onClick,
                             loading,
                             children,
                             ...props
                           }) => {
  const onClickHandler = (e) => {
    if (disabled || loading) return;
    isFunction(onClick) && onClick(e);
  };

  const { classes, cx } = LibraryNavbarItemStyles(
    { selected, disabled, loading, opened },
    { name: 'LibraryNavbarItem' }
  );

  const renderIcon = useCallback(() => {
    if (!icon) return;
    if (typeof icon === 'string') {
      return <ImageLoader className={classes.icon} src={icon} fillCurrent />;
    }
    return icon;
  }, [icon, classes]);

  return (
    <>
      <Box className={classes.root} onClick={onClickHandler}>
        <Box className={classes.item}>
          <Box className={classes.iconWrapper}>{renderIcon()}</Box>
          <Text className={classes.label}>{label}</Text>
        </Box>
        <Box className={classes.chev}>
          {canOpen ? <ChevUpIcon /> : null}
        </Box>
      </Box>
      {children && opened ? children : null}
    </>
  );
};

LibraryNavbarItem.defaultProps = LIBRARY_NAVBAR_ITEM_DEFAULT_PROPS;
LibraryNavbarItem.propTypes = LIBRARY_NAVBAR_ITEM_PROP_TYPES;

export { LibraryNavbarItem };
