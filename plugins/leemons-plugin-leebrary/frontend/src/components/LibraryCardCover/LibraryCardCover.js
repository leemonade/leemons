import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { Box, Button, COLORS, IconButton, ImageLoader, Menu } from '@bubbles-ui/components';
import { BookmarksIcon, DeleteBinIcon, SettingMenuVerticalIcon } from '@bubbles-ui/icons/solid/';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryCardCoverStyles } from './LibraryCardCover.styles';
import {
  LIBRARY_CARD_COVER_DEFAULT_PROPS,
  LIBRARY_CARD_COVER_PROP_TYPES,
  overlayVariants,
} from './LibraryCardCover.constants';
import { LibraryCardEmptyCover } from '../LibraryCardEmptyCover';

const LibraryCardCover = ({
  height,
  cover,
  color,
  fileIcon,
  parentHovered,
  menuItems,
  dashboard,
  subject,
  hideDashboardIcons,
  fileType,
  variantIcon,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { classes, cx } = LibraryCardCoverStyles(
    { color, height, parentHovered, subjectColor: subject?.color, showMenu },
    { name: 'LibraryCardCover' }
  );

  const icon = useMemo(
    () =>
      !isNil(fileIcon)
        ? React.cloneElement(fileIcon, { iconStyle: { backgroundColor: COLORS.interactive03h } })
        : null,
    [fileIcon]
  );

  useEffect(() => {
    if (!parentHovered && showMenu) {
      setShowMenu(false);
    }
  }, [parentHovered, showMenu]);

  const preventPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const iconRow = (
    <Box>
      <Box className={classes.iconRow}>
        <Box className={classes.leftContainer}>
          {!isEmpty(menuItems) && (
            <Box>
              <Menu
                opened={showMenu}
                onOpen={() => setShowMenu(true)}
                onClose={() => setShowMenu(false)}
                items={menuItems.map((item) => ({
                  ...item,
                  className: cx(classes.menuItem, item.className),
                }))}
                position="bottom-end"
                withinPortal={true}
                control={
                  <Box as="button" className={classes.ellipsisBox} onClick={preventPropagation}>
                    <SettingMenuVerticalIcon width={16} height={16} className={classes.menuIcon} />
                  </Box>
                }
              />
            </Box>
          )}
          {dashboard && !hideDashboardIcons && (
            <>
              <IconButton
                icon={<DeleteBinIcon width={16} height={16} className={classes.menuIcon} />}
                variant={'transparent'}
                size="xs"
              />
              <IconButton
                icon={<BookmarksIcon width={16} height={16} className={classes.menuIcon} />}
                variant={'transparent'}
                size="xs"
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );

  const MemoizedEmptyCover = useMemo(
    () => <LibraryCardEmptyCover icon={icon || variantIcon} fileType={fileType} />,
    [icon, variantIcon, fileType]
  );

  return (
    // <AnimatePresence>
    <Box className={classes.root}>
      <Box className={classes.color} />
      <Box className={classes.overlayTransparent}>
        {/* <motion.div
            key="overlay"
            variants={overlayVariants}
            animate={parentHovered ? 'visible' : 'hidden'}
          > */}
        <Box>{iconRow}</Box>
        {/* </motion.div> */}
      </Box>
      {cover ? (
        <ImageLoader src={cover} height={height} width={'100%'} forceImage />
      ) : (
        MemoizedEmptyCover
      )}
    </Box>
    // </AnimatePresence>
  );
};

export { LibraryCardCover };
export default LibraryCardCover;
LibraryCardCover.defaultProps = LIBRARY_CARD_COVER_DEFAULT_PROPS;
LibraryCardCover.propTypes = LIBRARY_CARD_COVER_PROP_TYPES;
