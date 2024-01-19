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
import { useHistory } from 'react-router-dom';
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
  category,
  ...props
}) => {
  const { ref: rootRef } = useElementSize();
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('assetsList'));
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const { title, name, updatedAt, image, cover, color, fileType, metadata, url, icon } = asset;
  const { classes } = LibraryCardEmbedStyles(
    { showPlayer, fullScreenMode, color, variant, fileType },
    { name: 'LibraryCardEmbed' }
  );
  const openInNewTab = (assetId) => {
    const isFile = variant === 'file';
    const isBookmark = ['bookmark', 'url'].includes(fileType) || category?.key === 'bookmarks';
    if (isBookmark) {
      window.open(url);
      return;
    }
    if (isFile) {
      history.push(url);
      return;
    }
    window.open(`/protected/leebrary/player/${assetId}`, '_blank', 'noopener,noreferrer');
  };
  const renderVariantButton = () => {
    const isMedia = category.key === 'media-files';
    const isBookmark = ['bookmark', 'url'].includes(fileType) || category?.key === 'bookmarks';
    const isVideo = fileType === 'video';
    const isAudio = fileType === 'audio';
    const isImage = fileType === 'image';
    const isFile = fileType === 'file';
    const isContentCreator = category?.key === 'assignables.content-creator';

    if (actionIcon) {
      return <Box style={{ marginBlock: 4 }}>{actionIcon}</Box>;
    }
    if (isImage) {
      return (
        <Box className={classes.fileTypeButtonContainer}>
          <SearchPlusIcon height={22} width={22} color={'#0C1F22'} />
        </Box>
      );
    }
    if (isBookmark || isContentCreator) {
      return (
        <Box className={classes.fileTypeButtonContainer}>
          <OpenIcon height={18} width={18} color={'#0C1F22'} />
        </Box>
      );
    }
    if (isMedia) {
      if (!isVideo && !isAudio && !isBookmark && !isFile && !isContentCreator) {
        return (
          <Box className={classes.fileTypeButtonContainer}>
            <DownloadIcon height={18} width={18} color={'#0C1F22'} />
          </Box>
        );
      }

      if (isFile) {
        if (asset?.fileExtension === 'pdf') {
          return (
            <Box className={classes.fileTypeButtonContainer}>
              <OpenIcon height={18} width={18} color={'#0C1F22'} />
            </Box>
          );
        }
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

    return (
      <Box className={classes.fileTypeButtonContainer}>
        hello
        <DownloadIcon height={18} width={18} color={'#0C1F22'} />
      </Box>
    );
  };

  useEffect(() => {
    document.addEventListener('fullscreenchange', () => {
      setFullScreenMode(!!document.fullscreenElement);
    });
  }, []);

  const MemoizedEmptyCover = useMemo(
    () => <CardEmptyCover icon={variantIcon ?? icon} fileType={fileType} />,
    [icon, variantIcon, fileType]
  );
  return (
    <Box ref={rootRef} className={classes.root} onClick={() => openInNewTab(asset?.id)}>
      {!showPlayer ? (
        <Stack className={classes.cardWrapper} justifyContent="space-between" fullWidth>
          <Box
            style={{
              width: 72,
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
  );
};

LibraryCardEmbed.defaultProps = LIBRARY_CARD_EMBED_DEFAULT_PROPS;
LibraryCardEmbed.propTypes = LIBRARY_CARD_EMBED_PROP_TYPES;

export { LibraryCardEmbed };
