import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  ImageLoader,
  Text,
  IconButton,
  TextClamp,
  FileIcon,
  COLORS,
  useElementSize,
} from '@bubbles-ui/components';
import { capitalize, isEmpty, isFunction } from 'lodash';
// import { ControlsPlayIcon } from '@bubbles-ui/icons/solid';
import {
  DownloadIcon,
  OpenIcon,
  SearchPlusIcon,
  CursorPlayerIcon,
} from '@bubbles-ui/icons/outline';
// TODO: AssetPlayer comes from @common
import { AssetPlayer } from '@bubbles-ui/leemons';
import { LibraryCardEmbedStyles } from './LibraryCardEmbed.styles';
import {
  LIBRARY_CARD_EMBED_DEFAULT_PROPS,
  LIBRARY_CARD_EMBED_PROP_TYPES,
} from './LibraryCardEmbed.constants';

const COVER_WIDTH = 160;

const getDomain = (url) => {
  const domain = url.split('//')[1];
  return (domain.split('/')[0] || '').replace('www.', '');
};

const LibraryCardEmbed = ({ asset, variant, labels, onDownload, actionIcon, ...props }) => {
  const { ref: rootRef, width } = useElementSize();
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const { title, name, updatedAt, image, cover, color, fileType, metadata, url, icon } = asset;
  const { classes, cx } = LibraryCardEmbedStyles(
    { showPlayer, fullScreenMode, color, variant, fileType },
    { name: 'LibraryCardEmbed' }
  );

  const renderVariantButton = () => {
    // const isMedia = variant === 'media';
    const isMedia = true;
    const isBookmark = ['bookmark', 'url'].includes(fileType) || variant === 'bookmark';
    const isVideo = fileType === 'video';
    const isAudio = fileType === 'audio';
    const isImage = fileType === 'image';

    if (actionIcon) {
      return <Box style={{ marginBlock: 4 }}>{actionIcon}</Box>;
    }
    if (isImage) {
      return (
        <Box className={classes.fileTypeButtonContainer}>
          <IconButton
            style={{ marginBlock: 4 }}
            icon={<SearchPlusIcon height={24} width={24} />}
            rounded
            onClick={() => {
              isFunction(onDownload) ? onDownload(asset) : window.open(url);
            }}
          />
        </Box>
      );
    }
    if (isMedia) {
      if (!isVideo && !isAudio) {
        return (
          <Box className={classes.fileTypeButtonContainer}>
            <IconButton
              style={{ marginBlock: 4 }}
              icon={<DownloadIcon height={13} width={13} />}
              rounded
              onClick={() => {
                isFunction(onDownload) ? onDownload(asset) : window.open(url);
              }}
            />
          </Box>
        );
      }
      return (
        <Box className={classes.fileTypeButtonContainer}>
          <IconButton
            // style={{ backgroundColor: COLORS.interactive01, marginBlock: 4 }}
            icon={
              isAudio || isVideo ? (
                <CursorPlayerIcon height={13} width={13} />
              ) : (
                <DownloadIcon height={13} width={13} />
              )
            }
            rounded
            onClick={() => {
              setShowPlayer(true);
              setIsPlaying(true);
            }}
          />
        </Box>
      );
    }
    if (isBookmark) {
      return (
        <Box className={classes.fileTypeButtonContainer} onClick={() => window.open(url)}>
          <IconButton
            style={{ marginBlock: 4 }}
            icon={<OpenIcon height={18} width={18} />}
            rounded
          />
        </Box>
      );
    }
    return (
      <Box className={classes.fileTypeButtonContainer}>
        <IconButton
          style={{ marginBlock: 4 }}
          icon={<DownloadIcon height={13} width={13} />}
          rounded
          onClick={() => {
            isFunction(onDownload) ? onDownload(asset) : window.open(url);
          }}
        />
      </Box>
    );
  };

  const getMediaRatio = () => {
    let mediaDimensions = {};
    metadata.reduce((prev, curr) => {
      if (curr.label.toLowerCase() === 'height') {
        prev = { ...prev, height: parseInt(curr.value) };
      }
      if (curr.label.toLowerCase() === 'width') {
        prev = { ...prev, width: parseInt(curr.value) };
      }
      mediaDimensions = prev;
      return prev;
    }, mediaDimensions);
    const { width, height } = mediaDimensions;
    if (!width || !height) return 16 / 9;
    return width / height;
  };

  const getMediaHeight = () => {
    if (!rootRef.current) return;
    const mediaRatio = getMediaRatio();
    return width / mediaRatio;
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullScreenMode(!!document.fullscreenElement);
    });
  }, []);

  return (
    <Box ref={rootRef} className={classes.root}>
      {!showPlayer ? (
        <Stack className={classes.cardWrapper} justifyContent="space-between" fullWidth>
          <Box
            style={{
              width: image || cover ? 72 : 'auto',
              display: 'flex',
              justifyContent: 'center',
              padding: '8px 4px',
            }}
          >
            {image || cover ? (
              <ImageLoader
                src={image || cover}
                width={72}
                height={58}
                radius={4}
                imageStyles={classes.imageStyles}
              />
            ) : (
              <Box className={classes.imagePlaceholder}>
                <FileIcon
                  size={64}
                  fileType={fileType}
                  color={COLORS.text06}
                  iconStyle={{ backgroundColor: COLORS.interactive03h }}
                  hideExtension
                />
              </Box>
            )}
          </Box>
          <Box
            className={classes.content}
            style={{ width: image || cover ? `calc(100% - ${COVER_WIDTH}px)` : '100%' }}
          >
            {/* <Box className={classes.color} /> */}
            <Box className={classes.header}>
              <TextClamp lines={1}>
                <Text size="md" className={classes.title}>
                  {title || name}
                </Text>
              </TextClamp>
              <Text className={classes.description}>
                {`last update: ${new Date(updatedAt).toLocaleDateString()}`}
              </Text>
            </Box>

            {/* <Box className={classes.footer}>
              <FileIcon
                size={13}
                fileType={variant === 'bookmark' ? 'bookmark' : fileType}
                color={'#636D7D'}
                label={capitalize(fileType) || 'File'}
                hideExtension
              />
              {variant === 'bookmark' && !isEmpty(url) && (
                <Stack spacing={2} alignItems="center">
                  {!isEmpty(icon) && (
                    <ImageLoader src={icon} width={20} height={20} radius={'4px'} />
                  )}
                  <Box>
                    <Text size="xs">{getDomain(url)}</Text>
                  </Box>
                </Stack>
              )}
            </Box> */}
          </Box>
          {renderVariantButton()}
        </Stack>
      ) : (
        <AssetPlayer asset={asset} playing={isPlaying} controlBar framed />
      )}
    </Box>
  );
};

LibraryCardEmbed.defaultProps = LIBRARY_CARD_EMBED_DEFAULT_PROPS;
LibraryCardEmbed.propTypes = LIBRARY_CARD_EMBED_PROP_TYPES;

export { LibraryCardEmbed };
