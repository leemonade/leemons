import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Stack,
  ImageLoader,
  Text,
  TextClamp,
  FileIcon,
  COLORS,
  useElementSize,
  CardEmptyCover,
} from '@bubbles-ui/components';
import {
  DownloadIcon,
  OpenIcon,
  SearchPlusIcon,
  CursorPlayerIcon,
} from '@bubbles-ui/icons/outline';
// TODO: AssetPlayer comes from @common
import { AssetPlayer } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@leebrary/helpers/prefixPN';
import { Link } from 'react-router-dom';
import { LibraryCardEmbedStyles } from './LibraryCardEmbed.styles';
import {
  LIBRARY_CARD_EMBED_DEFAULT_PROPS,
  LIBRARY_CARD_EMBED_PROP_TYPES,
} from './LibraryCardEmbed.constants';

const COVER_WIDTH = 160;

const LibraryCardEmbed = ({
  asset,
  variant,
  variantIcon,
  labels,
  onDownload,
  actionIcon,
  ...props
}) => {
  const { ref: rootRef } = useElementSize();
  const [t] = useTranslateLoader(prefixPN('assetsList'));
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const { title, name, updatedAt, image, cover, color, fileType, metadata, url, icon } = asset;
  const { classes } = LibraryCardEmbedStyles(
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
          <SearchPlusIcon height={18} width={18} color={'#0C1F22'} />
        </Box>
      );
    }
    if (isMedia) {
      if (!isVideo && !isAudio) {
        return (
          <Box className={classes.fileTypeButtonContainer}>
            <DownloadIcon height={18} width={18} color={'#0C1F22'} />
          </Box>
        );
      }
      return (
        <Box className={classes.fileTypeButtonContainer}>
          <Box
            icon={
              isAudio || isVideo ? (
                <CursorPlayerIcon height={18} width={18} color={'#0C1F22'} />
              ) : (
                <DownloadIcon height={18} width={18} color={'#0C1F22'} />
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
          <OpenIcon height={18} width={18} color={'#0C1F22'} />
        </Box>
      );
    }
    return (
      <Box className={classes.fileTypeButtonContainer}>
        <DownloadIcon height={18} width={18} color={'#0C1F22'} />
      </Box>
    );
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullScreenMode(!!document.fullscreenElement);
    });
  }, []);
  // console.log(fileType);
  const MemoizedEmptyCover = useMemo(
    () => <CardEmptyCover icon={variantIcon ?? icon} fileType={fileType} />,
    [icon, variantIcon, fileType]
  );

  return (
    <Link to={url} style={{ textDecoration: 'none' }}>
      <Box ref={rootRef} className={classes.root}>
        {!showPlayer ? (
          <Stack className={classes.cardWrapper} justifyContent="space-between" fullWidth>
            <Box
              style={{
                width: image || cover ? 72 : 'auto',
                display: 'flex',
                justifyContent: 'center',
                padding: '4px 8px',
                marginLeft: '8px',
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
                <Box className={classes.imagePlaceholder}>{MemoizedEmptyCover}</Box>
              )}
            </Box>
            <Box
              className={classes.content}
              style={{ width: image || cover ? `calc(100% - ${COVER_WIDTH}px)` : '100%' }}
            >
              <Box className={classes.header}>
                <TextClamp lines={1}>
                  <Text size="md" className={classes.title}>
                    {title || name}
                  </Text>
                </TextClamp>
                <Text className={classes.description}>
                  {`${t('lastUpdate')}: ${new Date(updatedAt).toLocaleDateString()}`}
                </Text>
              </Box>
            </Box>
            {renderVariantButton()}
          </Stack>
        ) : (
          <AssetPlayer asset={asset} playing={isPlaying} controlBar framed />
        )}
      </Box>
    </Link>
  );
};

LibraryCardEmbed.defaultProps = LIBRARY_CARD_EMBED_DEFAULT_PROPS;
LibraryCardEmbed.propTypes = LIBRARY_CARD_EMBED_PROP_TYPES;

export { LibraryCardEmbed };
