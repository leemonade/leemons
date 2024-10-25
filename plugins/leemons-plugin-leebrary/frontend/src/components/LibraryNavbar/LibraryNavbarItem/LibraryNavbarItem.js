/* eslint-disable consistent-return */
import { useCallback } from 'react';

import { Box, ImageLoader, Text, TextClamp, Stack } from '@bubbles-ui/components';
import { ChevUpIcon } from '@bubbles-ui/icons/outline';
import { isFunction } from 'lodash';

import {
  LIBRARY_NAVBAR_ITEM_DEFAULT_PROPS,
  LIBRARY_NAVBAR_ITEM_PROP_TYPES,
} from './LibraryNavbarItem.constants';
import { LibraryNavbarItemStyles } from './LibraryNavbarItem.styles';

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
}) => {
  const onClickHandler = (e) => {
    if (disabled || loading) return;
    if (isFunction(onClick)) return onClick(e);
  };

  const { classes } = LibraryNavbarItemStyles(
    { selected, disabled, loading, opened, canOpen },
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
        <Stack spacing={3} alignItems={!canOpen ? 'center' : 'flex-start'}>
          <Box className={classes.iconWrapper}>{renderIcon()}</Box>
          <TextClamp lines={2}>
            <Text className={classes.label}>{label}</Text>
          </TextClamp>
        </Stack>
        <Box className={classes.chev}>{canOpen ? <ChevUpIcon /> : null}</Box>
      </Box>
      {children && opened ? children : null}
    </>
  );
};

LibraryNavbarItem.defaultProps = LIBRARY_NAVBAR_ITEM_DEFAULT_PROPS;
LibraryNavbarItem.propTypes = LIBRARY_NAVBAR_ITEM_PROP_TYPES;

export { LibraryNavbarItem };
export default LibraryNavbarItem;
