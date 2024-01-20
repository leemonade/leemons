import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Stack,
  ModalZoom,
  ImageLoader,
  Text,
  Modal,
  TextClamp,
  ActionButton,
  CardEmptyCover,
} from '@bubbles-ui/components';
import { SearchPlusIcon, DownloadIcon, OpenIcon, CursorPlayerIcon } from '@bubbles-ui/icons/solid';
// TODO: AssetPlayer comes from @common
import { AssetPlayer } from '@bubbles-ui/leemons';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@leebrary/helpers/prefixPN';
import { useHistory } from 'react-router-dom';
import { LocaleDate } from '@common';
import { getFileUrl } from '@leebrary/helpers/prepareAsset';
import { LibraryCardEmbedStyles } from './LibraryCardEmbed.styles';
import {
  LIBRARY_CARD_EMBED_DEFAULT_PROPS,
  LIBRARY_CARD_EMBED_PROP_TYPES,
} from './LibraryCardEmbed.constants';

const LibraryCardEmbed = ({ asset, variant, variantIcon, actionIcon, category }) => {
  const history = useHistory();
  const [t] = useTranslateLoader(prefixPN('assetsList'));
  const [showPlayer, setShowPlayer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);
  const { title, name, updatedAt, image, cover, color, fileType, url, icon } = asset;
  const { classes } = LibraryCardEmbedStyles(
    { showPlayer, fullScreenMode, color, variant, fileType },
    { name: 'LibraryCardEmbed' }
  );
  // Lógica de apertura de assets
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
    window.open(`/protected/leebrary/play/${assetId}`, '_blank', 'noopener,noreferrer');
  };

  const isPlayable = React.useMemo(() => {
    const playableFileExtensions = ['mp4', 'webm', 'mp3'];
    const playableMedia = ['video', 'audio'];
    return (
      playableFileExtensions.includes(asset.fileExtension) ||
      playableMedia.includes(asset.mediaType)
    );
  }, [asset]);

  // Lógica de iconos parte derecha
  const getIconForFileType = () => {
    const iconProps = { height: 18, width: 18 };
    switch (fileType) {
      case 'image':
        return <SearchPlusIcon {...iconProps} />;
      case 'bookmark':
        if (['video', 'audio'].includes(asset.mediaType)) {
          return <CursorPlayerIcon {...iconProps} />;
        }
        return <OpenIcon {...iconProps} />;
      case 'assignables.content-creator':
        return <OpenIcon {...iconProps} />;
      case 'file':
        if (asset?.fileExtension === 'pdf') {
          return <OpenIcon {...iconProps} />;
        }
        return <DownloadIcon {...iconProps} />;
      case 'video':
      case 'audio':
        if (isPlayable) return <CursorPlayerIcon {...iconProps} />;
        return <DownloadIcon {...iconProps} />;
      default:
        return <DownloadIcon {...iconProps} />;
    }
  };

  const renderVariantIcon = () => {
    if (actionIcon) {
      return actionIcon;
    }
    return getIconForFileType();
  };

  const handlePlayAsset = () => {
    if (isPlayable) {
      setShowPlayer(true);
      setIsPlaying(true);
    } else if (fileType === 'image') {
      setIsPlaying(true);
    } else {
      openInNewTab(asset?.original?.id);
    }
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

  const getAssetPlayableProps = isPlayable
    ? { url: asset.url, fileType: asset.mediaType ?? fileType }
    : {};

  return (
    <Box className={classes.root}>
      {isPlayable && isPlaying ? (
        <Modal opened={showPlayer} onClose={() => setShowPlayer(false)} size="75%">
          <AssetPlayer
            asset={{ ...asset, ...getAssetPlayableProps }}
            playing
            controlBar
            useAspectRatio
          />
        </Modal>
      ) : null}

      {fileType === 'image' && (
        <ModalZoom hideButton opened={isPlaying} onClose={() => setIsPlaying(false)}>
          <ImageLoader src={image || cover} width={500} height="auto" />
        </ModalZoom>
      )}

      <Stack alignItems="center" fullWidth spacing={4}>
        <Box
          noFlex
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

        <Stack direction="column" fullWidth>
          <Box style={{ width: '100%' }}>
            <TextClamp lines={1}>
              <Text size="md" className={classes.title}>
                {title || name}
              </Text>
            </TextClamp>
          </Box>
          <Box>
            <Text>
              {`${t('lastUpdate')}: `}
              <LocaleDate
                date={updatedAt}
                options={{
                  year: '2-digit',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                }}
              />
            </Text>
          </Box>
        </Stack>

        <Box noFlex>
          <ActionButton onClick={handlePlayAsset} icon={renderVariantIcon()} />
        </Box>
      </Stack>
    </Box>
  );
};

LibraryCardEmbed.defaultProps = LIBRARY_CARD_EMBED_DEFAULT_PROPS;
LibraryCardEmbed.propTypes = LIBRARY_CARD_EMBED_PROP_TYPES;

export { LibraryCardEmbed };
