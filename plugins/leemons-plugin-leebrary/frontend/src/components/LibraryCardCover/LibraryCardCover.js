import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isEmpty, isNil, isString, noop } from 'lodash';
import { Box, COLORS, IconButton, ImageLoader, Menu, CardEmptyCover } from '@bubbles-ui/components';
import { BookmarksIcon, DeleteBinIcon, SettingMenuVerticalIcon } from '@bubbles-ui/icons/solid/';
import { isLRN as stringIsLRN } from '@leebrary/helpers/isLRN';
import useFileCopyright from '@leebrary/request/hooks/queries/useFileCopyright';
import { LibraryCardCoverStyles } from './LibraryCardCover.styles';
import {
  LIBRARY_CARD_COVER_DEFAULT_PROPS,
  LIBRARY_CARD_COVER_PROP_TYPES,
} from './LibraryCardCover.constants';

import { LibraryCardMenuSkeletonItems } from './LibraryCardMenuSkeletonItems';
import CoverCopyright from '../Copyright/CoverCopyright';

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
  onShowMenu = noop,
  menuItemsLoading = null,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  // As the Menu onClose function is called when props change, we use this as a flag to control the behavior of menus with dynamic items
  const [dynamicItemsAlreadyLoaded, setDynamicItemsAlreadyLoaded] = useState(
    menuItemsLoading === true ? false : null
  );
  const { classes, cx } = LibraryCardCoverStyles(
    { color, height, parentHovered, subjectColor: subject?.color, showMenu },
    { name: 'LibraryCardCover' }
  );

  const fileIdToFetchCopyright = useMemo(() => {
    if (!isString(original?.cover)) return null;

    const isLRN = stringIsLRN(original.cover);
    if (isLRN) {
      return original.cover;
    }

    const isUrlToFile = original.cover.startsWith('http') && original.cover.includes('lrn');
    if (isUrlToFile) {
      return original.cover.match(/lrn:[^?]+/)[0];
    }

    return null;
  }, [original]);

  const { data: coverCopyrightDataFetched } = useFileCopyright({
    id: fileIdToFetchCopyright,
    enabled: !!fileIdToFetchCopyright,
  });

  const coverSource = useMemo(() => {
    const fileIsAnImage = fileType === 'image';
    const isExternalUrl = url && url.startsWith('http') && url.includes('unsplash');
    const hasCopyright = !isEmpty(file?.copyright);

    if (fileIsAnImage && isExternalUrl && hasCopyright) {
      return url;
    }

    if (original?.cover?.externalUrl) {
      return original.cover.externalUrl;
    }

    // Non-image Assets creation cases
    if (coverCopyrightDataFetched?.externalUrl) {
      return coverCopyrightDataFetched.externalUrl;
    }

    // No cover or cover does not come from external source
    return cover;
  }, [
    cover,
    url,
    fileType,
    file?.copyright,
    original?.cover?.externalUrl,
    coverCopyrightDataFetched,
  ]);

  const getCoverCopyright = useCallback(() => {
    const fileIsAnImage = fileType === 'image';

    if (fileIsAnImage) {
      if (!file.copyright) return null;
      const { author, authorProfileUrl, providerUrl, provider } = file.copyright;

      return (
        <CoverCopyright
          author={author}
          authorUrl={authorProfileUrl}
          source={provider}
          sourceUrl={providerUrl}
          bottomOffset={-6}
        />
      );
    }

    if (original?.cover?.copyright) {
      const { author, authorProfileUrl, providerUrl, provider } = original.cover.copyright;
      return (
        <CoverCopyright
          author={author}
          authorUrl={authorProfileUrl}
          source={provider}
          sourceUrl={providerUrl}
          bottomOffset={-6}
        />
      );
    }

    if (coverCopyrightDataFetched?.copyright) {
      const { author, authorProfileUrl, providerUrl, provider } =
        coverCopyrightDataFetched.copyright;
      return (
        <CoverCopyright
          author={author}
          authorUrl={authorProfileUrl}
          source={provider}
          sourceUrl={providerUrl}
          bottomOffset={-6}
        />
      );
    }
    return null;
  }, [original, file, coverCopyrightDataFetched]);

  useEffect(() => {
    if (menuItemsLoading === false) {
      setDynamicItemsAlreadyLoaded(true);
    }
  }, [menuItemsLoading]);

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

  const menuSkeletonItems = [{ children: <LibraryCardMenuSkeletonItems items={2} /> }];

  const heightAndSubjectColor = color ? height : height + 6;
  const iconRow = (
    <Box>
      <Box className={classes.iconRow}>
        <Box className={classes.leftContainer}>
          {!isEmpty(menuItems) && (
            <Box>
              <Menu
                opened={showMenu}
                onOpen={() => {
                  setShowMenu(true);
                  onShowMenu(true);
                }}
                onClose={() => {
                  if (menuItemsLoading === null || dynamicItemsAlreadyLoaded) {
                    setShowMenu(false);
                  }
                  onShowMenu(false);
                }}
                items={(menuItemsLoading ? menuSkeletonItems : menuItems).map((item) => ({
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
      {(original?.cover?.copyright || file?.copyright || !isEmpty(coverCopyrightDataFetched)) &&
        getCoverCopyright()}
    </Box>
    // </AnimatePresence>
  );
};

export { LibraryCardCover };
export default LibraryCardCover;
LibraryCardCover.defaultProps = LIBRARY_CARD_COVER_DEFAULT_PROPS;
LibraryCardCover.propTypes = LIBRARY_CARD_COVER_PROP_TYPES;
