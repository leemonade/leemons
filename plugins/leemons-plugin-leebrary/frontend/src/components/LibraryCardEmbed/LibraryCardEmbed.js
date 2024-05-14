import React, { useMemo } from 'react';
import { Box, Stack, ImageLoader, Text, TextClamp, CardEmptyCover } from '@bubbles-ui/components';
import { SearchPlusIcon, DownloadIcon, OpenIcon, CursorPlayerIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import prefixPN from '@leebrary/helpers/prefixPN';
import { LocaleDate } from '@common';
import { LibraryCardEmbedStyles } from './LibraryCardEmbed.styles';
import {
  LIBRARY_CARD_EMBED_DEFAULT_PROPS,
  LIBRARY_CARD_EMBED_PROP_TYPES,
} from './LibraryCardEmbed.constants';
import { LibraryCardEmbedSkeleton } from './LibraryCardEmbdedSkeleton';

const LibraryCardEmbed = ({
  asset,
  variantIcon,
  actionIcon,
  assetsLoading,
  canPlay,
  ccMode,
  handleClickCCreator,
  hideIcon,
}) => {
  const [t] = useTranslateLoader(prefixPN('assetsList'));
  const { title, name, updatedAt, image, cover, fileType, icon } = asset;
  const { classes } = LibraryCardEmbedStyles({ canPlay }, { name: 'LibraryCardEmbed' });
  const isPlayable = React.useMemo(() => {
    const playableFileExtensions = [
      'mov',
      'qt',
      'mp4',
      'webm',
      'mp3',
      'mpga',
      'ogg',
      'wav',
      'mpeg',
    ];
    const playableMedia = ['video', 'audio'];
    return (
      playableFileExtensions.includes(asset.fileExtension) ||
      playableMedia.includes(asset.mediaType)
    );
  }, [asset]);
  // Lógica de iconos parte derecha
  const getIconForFileType = () => {
    if (hideIcon) return null;

    const iconProps = { height: 18, width: 18 };

    if (ccMode) {
      switch (fileType) {
        case 'image':
          return <OpenIcon {...iconProps} onClick={() => !canPlay && handleClickCCreator()} />;
        case 'bookmark':
          return <OpenIcon {...iconProps} onClick={() => !canPlay && handleClickCCreator()} />;
        case 'video':
          return <OpenIcon {...iconProps} onClick={() => !canPlay && handleClickCCreator()} />;
        default:
          return <DownloadIcon {...iconProps} onClick={() => !canPlay && handleClickCCreator()} />;
      }
    }
    switch (fileType) {
      case 'image':
        return <SearchPlusIcon {...iconProps} />;
      case 'bookmark':
        if (['video', 'audio'].includes(asset.mediaType)) {
          return <CursorPlayerIcon {...iconProps} />;
        }
        return <OpenIcon {...iconProps} />;
      case 'content-creator':
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

  const MemoizedEmptyCover = useMemo(
    () => <CardEmptyCover icon={variantIcon ?? icon} fileType={fileType} height={72} />,
    [icon, variantIcon, fileType]
  );

  if (assetsLoading) {
    return <LibraryCardEmbedSkeleton />;
  }

  return (
    <Box className={classes.root} onClick={() => ccMode && canPlay && handleClickCCreator()}>
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
          {updatedAt && (
            <Box>
              <Text>
                {`${t('lastUpdate')}: `}
                {
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
                }
              </Text>
            </Box>
          )}
        </Stack>
        <Box noFlex className={classes.variantIcon}>
          {renderVariantIcon()}
        </Box>
      </Stack>
    </Box>
  );
};

LibraryCardEmbed.defaultProps = LIBRARY_CARD_EMBED_DEFAULT_PROPS;
LibraryCardEmbed.propTypes = LIBRARY_CARD_EMBED_PROP_TYPES;

export { LibraryCardEmbed };
