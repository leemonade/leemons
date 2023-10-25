import React, { useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { Box, COLORS, IconButton, ImageLoader, Menu } from '@bubbles-ui/components';
import { BookmarksIcon, DeleteBinIcon, SettingMenuVerticalIcon } from '@bubbles-ui/icons/solid/';
import { motion, AnimatePresence } from 'framer-motion';
import { LibraryCardCoverStyles } from './LibraryCardCover.styles';
import {
  LIBRARY_CARD_COVER_DEFAULT_PROPS,
  LIBRARY_CARD_COVER_PROP_TYPES,
  overlayVariants,
} from './LibraryCardCover.constants';
import { LibraryCardEmptyCover } from '../LibraryCardEmptyCover';
import { FavButton } from '../FavButton';

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
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const { classes, cx } = LibraryCardCoverStyles(
    { color, height, parentHovered, subjectColor: subject?.color, isFav },
    { name: 'LibraryCardCover' }
  );
  const handleIsFav = () => {
    setIsFav(!isFav);
  };

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
                opened={showMenu && parentHovered}
                onOpen={() => setShowMenu(true)}
                onClose={() => setShowMenu(false)}
                items={menuItems.map((item) => ({
                  ...item,
                  className: cx(classes.menuItem, item.className),
                }))}
                position="bottom-start"
                withinPortal={true}
                control={
                  <IconButton
                    icon={
                      <SettingMenuVerticalIcon
                        width={26}
                        height={26}
                        className={classes.menuIcon}
                      />
                    }
                    variant={'transparent'}
                    size="xs"
                    onClick={preventPropagation}
                    className={classes.menuButton}
                  />
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
        <Box onClick={() => handleIsFav()} className={classes.favButton}>
          <FavButton isActive={isFav} isParentHovered={parentHovered} />
        </Box>
      </Box>
    </Box>
  );

  return (
    <AnimatePresence>
      <Box className={classes.root}>
        <Box className={classes.color} />
        <Box className={classes.overlayTransparent}>
          <motion.div
            key="overlay"
            variants={overlayVariants}
            animate={parentHovered ? 'visible' : 'hidden'}
          >
            <Box className={classes.overlayGradient} />
            <Box>{iconRow}</Box>
          </motion.div>
          <Box className={classes.favActive}>{isFav && !parentHovered && iconRow}</Box>
        </Box>
        {cover ? (
          <ImageLoader src={cover} height={height} width={'100%'} forceImage />
        ) : (
          <LibraryCardEmptyCover icon={icon} fileType={fileType} />
        )}
      </Box>
    </AnimatePresence>
  );
};

export { LibraryCardCover };
export default LibraryCardCover;
LibraryCardCover.defaultProps = LIBRARY_CARD_COVER_DEFAULT_PROPS;
LibraryCardCover.propTypes = LIBRARY_CARD_COVER_PROP_TYPES;
