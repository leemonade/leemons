import React, { useEffect, useState } from 'react';
import { isEmpty, isFunction } from 'lodash';
import { ActionButton, AvatarsGroup, Box, FileIcon, Stack, Text } from '@bubbles-ui/components';
import { MoveRightIcon } from '@bubbles-ui/icons/outline';
import { LibraryDetailContent } from '../LibraryDetailContent';
import { LibraryDetailToolbar } from '../LibraryDetailToolbar';
import { LibraryDetailPlayer } from '../LibraryDetailPlayer';
import { LibraryDetailStyles } from './LibraryDetail.styles';
import {
  AssetBookmarkIcon,
  AssetPathIcon,
  AssetTaskIcon,
  PluginCurriculumIcon,
} from '@bubbles-ui/icons/solid';
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

  const { fileType, fileExtension } = asset;

  const handleToggle = () => {
    isFunction(events?.onToggle) && events.onToggle();
  };

  return (
    <Box style={{ position: 'absolute', height: '100%', width: '100%' }}>
      <Stack
        direction="column"
        fullHeight
        className={cx(classes.root, classes.wrapper, { [classes.show]: showDrawer })}
        style={style}
      >
        <Stack
          direction="column"
          fullHeight
          // className={cx(classes.wrapper, { [classes.show]: showDrawer })}
        >
          {toolbar && (
            <Box>
              <LibraryDetailToolbar
                {...events}
                item={asset}
                toolbarItems={toolbarItems}
                open={open}
                labels={labels}
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
                  fileExtension={asset.fileExtension}
                  fileType={asset.fileType || variant}
                  color={'#B9BEC4'}
                  hideExtension
                />
              )
            }
          />
          <LibraryDetailContent
            {...asset}
            excludeMetadatas={excludeMetadatas}
            variantIcon={variantIcon}
            variantTitle={variantTitle}
            variant={variant}
            labels={labels}
          />
          {!asset.public && (!isEmpty(asset?.canAccess) || !isEmpty(asset?.classesCanAccess)) && (
            <Stack direction="column" spacing={2} padding={4}>
              <Text role="productive" size="xs">
                {asset.isPrivate ? labels.privated : labels.sharedWith}
              </Text>
              <AvatarsGroup
                size="sm"
                data={asset.canAccess}
                numberFromClassesAndData
                moreThanUsersAsMulti={2}
                customAvatarMargin={4}
                zIndexInverted
                classesData={asset?.classesCanAccess}
                limit={3}
              />
            </Stack>
          )}
          {asset.public && (
            <Stack direction="column" spacing={2} padding={4}>
              <Text role="productive" size="xs">
                {labels.sharedWithEverybody}
              </Text>
            </Stack>
          )}
        </Stack>
      </Stack>
      {toolbarItems?.toggle && (
        <Box className={cx(classes.lastIcon, { [classes.stickRight]: !showDrawer && !open })}>
          <ActionButton
            icon={<MoveRightIcon height={20} width={20} />}
            onClick={handleToggle}
            tooltip={!open ? toolbarItems.open || toolbarItems.toggle : toolbarItems.toggle}
            className={cx(classes.button, {
              [classes.flip]: !showDrawer,
            })}
          />
        </Box>
      )}
    </Box>
  );
};

LibraryDetail.defaultProps = LIBRARY_DETAIL_DEFAULT_PROPS;
LibraryDetail.propTypes = LIBRARY_DETAIL_PROP_TYPES;

export { LibraryDetail };
