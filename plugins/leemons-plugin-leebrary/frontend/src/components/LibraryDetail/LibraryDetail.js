import React, { useEffect, useState } from 'react';
import { isEmpty, isFunction } from 'lodash';
import { ActionButton, AvatarsGroup, Box, FileIcon, Stack, Text } from '@bubbles-ui/components';
import { MoveRightIcon } from '@bubbles-ui/icons/outline';
import {
  AssetBookmarkIcon,
  AssetPathIcon,
  AssetTaskIcon,
  PluginCurriculumIcon,
} from '@bubbles-ui/icons/solid';
import { LibraryDetailContent } from '../LibraryDetailContent';
import { LibraryDetailToolbar } from '../LibraryDetailToolbar';
import { LibraryDetailPlayer } from '../LibraryDetailPlayer';
import { LibraryDetailStyles } from './LibraryDetail.styles';
import { LIBRARY_DETAIL_DEFAULT_PROPS, LIBRARY_DETAIL_PROP_TYPES } from './LibraryDetail.constants';

const LibraryDetail = ({
  asset,
  variant,
  variantIcon,
  variantTitle,
  toolbar,
  toolbarItems,
  drawer,
  open,
  labels,
  titleActionButton,
  style,
  excludeMetadatas,
  onCloseDrawer,
  metadataComponent,
  ...events
}) => {
  const [showDrawer, setShowDrawer] = useState(open);
  useEffect(() => {
    if (open) {
      setTimeout(() => setShowDrawer(true), 100);
    } else {
      setTimeout(() => setShowDrawer(false), 100);
    }
  }, [open]);

  const { classes, cx } = LibraryDetailStyles({ drawer, open }, { name: 'LibraryDetail' });

  // const { fileExtension } = asset;
  const fileExtension = asset?.fileExtension;

  return (
    <Box
      style={{ position: 'absolute', height: '100%', width: '100%' }}
      data-cypress-id="library-detail-drawer"
    >
      <Stack
        direction="column"
        fullHeight
        className={cx(classes.root, classes.wrapper, { [classes.show]: showDrawer })}
        style={style}
      >
        <Stack direction="column" fullHeight>
          {toolbar && (
            <Box>
              <LibraryDetailToolbar
                {...events}
                item={asset}
                toolbarItems={toolbarItems}
                open={open}
                labels={labels}
                onCloseDrawer={onCloseDrawer}
              />
            </Box>
          )}

          <LibraryDetailPlayer
            {...{ ...asset, fileExtension }}
            labels={labels}
            variant={variant}
            variantTitle={variantTitle}
            titleActionButton={titleActionButton}
            fileIcon={
              {
                bookmark: (
                  <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                    <AssetBookmarkIcon />
                  </Box>
                ),
                path: (
                  <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                    <AssetPathIcon />
                  </Box>
                ),
                task: (
                  <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                    <AssetTaskIcon />
                  </Box>
                ),
                curriculum: (
                  <Box style={{ fontSize: 64, lineHeight: 1, color: '#B9BEC4' }}>
                    <PluginCurriculumIcon />
                  </Box>
                ),
              }[variant] || (
                <FileIcon
                  size={64}
                  fileExtension={asset?.fileExtension}
                  fileType={asset?.fileType || variant}
                  color={'#B9BEC4'}
                  hideExtension
                />
              )
            }
          />
          <LibraryDetailContent
            {...asset}
            asset={asset}
            onShare={events.onShare}
            excludeMetadatas={excludeMetadatas}
            variantIcon={variantIcon}
            variantTitle={variantTitle}
            variant={variant}
            labels={labels}
            metadataComponent={metadataComponent}
          />
        </Stack>
      </Stack>
    </Box>
  );
};

LibraryDetail.defaultProps = LIBRARY_DETAIL_DEFAULT_PROPS;
LibraryDetail.propTypes = LIBRARY_DETAIL_PROP_TYPES;

export default LibraryDetail;
export { LibraryDetail };
