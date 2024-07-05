import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil } from 'lodash';
import { Box, COLORS, IconButton, ImageLoader, Menu, CardEmptyCover } from '@bubbles-ui/components';
import { BookmarksIcon, DeleteBinIcon, SettingMenuVerticalIcon } from '@bubbles-ui/icons/solid/';
import { LibraryCardCoverStyles } from './LibraryCardCover.styles';
import {
  LIBRARY_CARD_COVER_DEFAULT_PROPS,
  LIBRARY_CARD_COVER_PROP_TYPES,
} from './LibraryCardCover.constants';
import CoverCopyright from './CoverCopyright';

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
  url,
  file,
  original,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const { classes, cx } = LibraryCardCoverStyles(
    { color, height, parentHovered, subjectColor: subject?.color, showMenu },
    { name: 'LibraryCardCover' }
  );

  const coverSource = useMemo(() => {
    const fileIsAnImage = fileType === 'image';
    const isUrl = url && url.startsWith('http') && url.includes('unsplash');
    const hasCopyright = !isEmpty(file?.copyright);

    if (fileIsAnImage && isUrl && hasCopyright) {
      return url;
    }

    if (original.cover?.externalUrl) {
      return original.cover.externalUrl;
    }
    return cover; // Asset creation case
  }, [cover, url, fileType, file?.copyright, original?.cover?.externalUrl]);

  const icon = useMemo(
    () =>
      !isNil(fileIcon)
        ? React.cloneElement(fileIcon, { iconStyle: { backgroundColor: COLORS.interactive03h } })
        : null,
    [fileIcon]
  );

  const getCoverCopyright = useCallback(() => {
    const fileIsAnImage = fileType === 'image';

    if (fileIsAnImage) {
      if (!file.copyright) return null;
      const { author, authorProfileUrl, providerUrl, provider } = file.copyright;
      const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

      return (
        <CoverCopyright
          author={author}
          authorUrl={authorProfileUrl}
          source={providerText}
          sourceUrl={providerUrl}
          bottomOffset={-6}
        />
      );
    }

    if (!original?.cover?.copyright) return null;
    const { author, authorProfileUrl, providerUrl, provider } = original.cover.copyright;
    const providerText = provider.charAt(0).toUpperCase() + provider.slice(1);

    return (
      <CoverCopyright
        author={author}
        authorUrl={authorProfileUrl}
        source={providerText}
        sourceUrl={providerUrl}
        bottomOffset={-6}
      />
    );
  }, [original]);

  useEffect(() => {
    if (!parentHovered && showMenu) {
      setShowMenu(false);
    }
  }, [parentHovered, showMenu]);

  const preventPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const heightAndSubjectColor = color ? height : height + 6;
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
    () => <CardEmptyCover icon={variantIcon ?? icon} fileType={fileType} />,
    [icon, variantIcon, fileType]
  );

  return (
    <Box className={classes.root}>
      {color && <Box className={classes.color} />}
      <Box className={classes.overlayTransparent}>
        <Box>{iconRow}</Box>
      </Box>
      {coverSource ? (
        <ImageLoader src={coverSource} height={heightAndSubjectColor} width={'100%'} forceImage />
      ) : (
        MemoizedEmptyCover
      )}
      {file?.copyright && getCoverCopyright()}
    </Box>
    // </AnimatePresence>
  );
};

export { LibraryCardCover };
export default LibraryCardCover;
LibraryCardCover.defaultProps = LIBRARY_CARD_COVER_DEFAULT_PROPS;
LibraryCardCover.propTypes = LIBRARY_CARD_COVER_PROP_TYPES;
