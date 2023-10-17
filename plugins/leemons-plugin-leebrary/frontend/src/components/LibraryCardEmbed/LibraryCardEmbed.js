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
import { ControlsPlayIcon } from '@bubbles-ui/icons/solid';
import { DownloadIcon, OpenIcon } from '@bubbles-ui/icons/outline';
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

  const { title, name, description, image, cover, color, fileType, metadata, url, icon } = asset;

  const renderVariantButton = () => {
    const isMedia = variant === 'media';
    const isBookmark = ['bookmark', 'ur'].includes(fileType) || variant === 'bookmark';
    const isVideo = fileType === 'video';
    const isAudio = fileType === 'audio';

    if (actionIcon) {
      return <Box style={{ marginBlock: 4 }}>{actionIcon}</Box>;
    }
    if (isMedia) {
      if (!isVideo && !isAudio) {
        return (
          <IconButton
            style={{ marginBlock: 4 }}
            icon={<DownloadIcon height={13} width={13} />}
            rounded
            onClick={() => {
              isFunction(onDownload) ? onDownload(asset) : window.open(url);
            }}
          />
        );
      }
      return (
        <IconButton
          style={{ backgroundColor: COLORS.interactive01, marginBlock: 4 }}
          icon={
            isAudio || isVideo ? (
              <ControlsPlayIcon height={13} width={13} style={{ color: 'white' }} />
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
      );
    }
    if (isBookmark)
      return (
        <Box className={classes.bookmarkButton} onClick={() => window.open(url)}>
          <IconButton
            style={{ marginBlock: 4 }}
            icon={<OpenIcon height={13} width={13} />}
            rounded
          />
          <Text>{labels.link}</Text>
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
    const mediaHeight = width / mediaRatio;
    return mediaHeight;
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullScreenMode(!!document.fullscreenElement);
    });
  }, []);

  const { classes, cx } = LibraryCardEmbedStyles(
    { showPlayer, fullScreenMode, color, variant, fileType },
    { name: 'LibraryCardEmbed' }
  );
  return (
    <Box ref={rootRef} className={classes.root}>
      {!showPlayer ? (
        <Stack className={classes.cardWrapper} justifyContent="start" fullWidth>
          <Box style={{ width: image || cover ? COVER_WIDTH : 'auto' }}>
            {image || cover ? (
              <ImageLoader
                src={image || cover}
                width={COVER_WIDTH}
                height={'100%'}
                radius={'2px 0px 0px 2px'}
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
            <Box className={classes.color} />
            <Box className={classes.header}>
              <Text size="md" className={classes.title}>
                {title || name}
              </Text>
              {renderVariantButton()}
            </Box>
            <Box className={classes.description}>
              <TextClamp>
                <Text role="productive">{description}</Text>
              </TextClamp>
            </Box>
            <Box className={classes.footer}>
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
            </Box>
          </Box>
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
