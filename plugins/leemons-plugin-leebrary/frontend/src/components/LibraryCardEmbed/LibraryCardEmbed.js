import React, { useMemo } from 'react';

import useRolesLocalizations from '@assignables/hooks/useRolesLocalizations';
import { Box, Stack, Text, TextClamp, CardEmptyCover, Badge } from '@bubbles-ui/components';
import { SearchPlusIcon, DownloadIcon, OpenIcon, CursorPlayerIcon } from '@bubbles-ui/icons/solid';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { capitalize, isObject } from 'lodash';

import Cover from '../Cover';

import { LibraryCardEmbedSkeleton } from './LibraryCardEmbdedSkeleton';
import {
  LIBRARY_CARD_EMBED_DEFAULT_PROPS,
  LIBRARY_CARD_EMBED_PROP_TYPES,
} from './LibraryCardEmbed.constants';
import { LibraryCardEmbedStyles } from './LibraryCardEmbed.styles';

import prefixPN from '@leebrary/helpers/prefixPN';

const LibraryCardEmbed = ({
  asset,
  variantIcon,
  actionIcon,
  assetsLoading,
  canPlay,
  ccMode,
  handleClickCCreator,
  hideIcon,
  fullWidth,
  hasActionButton,
}) => {
  const [t] = useTranslateLoader(prefixPN('assetsList'));
  const { title, name, image, cover, fileType, icon } = asset;
  const { classes } = LibraryCardEmbedStyles({ canPlay, fullWidth }, { name: 'LibraryCardEmbed' });
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
      (isObject(asset.file) && playableFileExtensions.includes(asset.file?.extension)) ||
      playableMedia.includes(asset.mediaType)
    );
  }, [asset]);

  const roleLocalizations = useRolesLocalizations([asset?.original?.providerData?.role]);

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
  const getAssetBadgeType = () => {
    if (asset?.original?.providerData?.role) {
      return capitalize(roleLocalizations?.[asset?.original?.providerData?.role]?.singular);
    }
    const typeMappings = {
      image: 'Image',
      bookmark: ['video'].includes(asset.mediaType) ? 'Video' : 'Bookmark',
      'content-creator': 'Content creator',
      file: asset?.fileExtension === 'pdf' ? 'PDF' : 'File',
      video: 'Video',
      audio: 'Audio',
      document: asset?.fileExtension === 'pdf' ? 'PDF' : 'Document',
    };

    return typeMappings[fileType] ?? capitalize(asset?.fileExtension ?? fileType ?? 'Media');
  };

  const renderVariantIcon = () => {
    if (actionIcon) {
      return actionIcon;
    }
    return getIconForFileType();
  };

  const badgeCategory = getAssetBadgeType();

  const MemoizedEmptyCover = useMemo(
    () => <CardEmptyCover icon={variantIcon ?? icon} fileType={fileType} height={60} />,
    [icon, variantIcon, fileType]
  );

  if (assetsLoading) {
    return <LibraryCardEmbedSkeleton />;
  }

  return (
    <Box className={classes.root} onClick={() => ccMode && canPlay && handleClickCCreator()}>
      <Stack alignItems="center" fullWidth spacing={2}>
        <Box
          noFlex
          style={{
            width: 72,
            display: 'flex',
            margin: '8px 8px',
          }}
        >
          {image || cover ? (
            <Cover asset={asset} height={60} width={72} hideCopyright radius={4} />
          ) : (
            <Box className={classes.imagePlaceholder}>{MemoizedEmptyCover}</Box>
          )}
        </Box>

        <Stack direction="column" fullWidth alignContent="start" className={classes.bodyContainer}>
          <Stack>
            <TextClamp lines={1}>
              <Text size="md" className={classes.title}>
                {title || name}
              </Text>
            </TextClamp>
          </Stack>
          <Badge size="xs" label={badgeCategory} closable={false} radius={'default'} disableHover />
        </Stack>
        <Box noFlex className={classes.variantIcon}>
          {hasActionButton && renderVariantIcon()}
        </Box>
      </Stack>
    </Box>
  );
};

LibraryCardEmbed.defaultProps = LIBRARY_CARD_EMBED_DEFAULT_PROPS;
LibraryCardEmbed.propTypes = LIBRARY_CARD_EMBED_PROP_TYPES;

export { LibraryCardEmbed };
