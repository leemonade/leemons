import React, { useMemo } from 'react';
import { Box, ImageLoader, CardEmptyCover } from '@bubbles-ui/components';
import { ButtonIcon } from '@leebrary/components/AssetPlayer/components/ButtonIcon';
import { AssetPlayer } from '@leebrary/components/AssetPlayer';
import { isEmpty } from 'lodash';
import { AssetPlayerLibraryWrapperStyles } from './AssetPlayerLibraryWrapper.styles';
import {
  ASSET_PLAYER_LIBRARY_WRAPPER_DEFAULT_PROPS,
  ASSET_PLAYER_LIBRARY_WRAPPER_PROP_TYPES,
} from './AssetPlayerLibraryWrapper.constants';

const AssetPlayerLibraryWrapper = ({ asset }) => {
  const assetRole = asset?.providerData?.role;
  const fileExtension = asset?.fileExtension;
  const isPDF = fileExtension === 'pdf';
  const fileTypeCondition = asset?.fileType === 'document' || asset?.fileType === 'application';
  const isDocumentButNotPDF = fileTypeCondition && !isPDF;
  const { classes } = AssetPlayerLibraryWrapperStyles(
    { color: asset?.color, assetRole, isPDF, isDocumentButNotPDF },
    { name: 'LibraryDetailPlayer' }
  );
  const libraryProps = {
    height: 200,
    width: 576,
    asset,
    hideURLInfo: true,
    viewPDF: false,
    compact: true,
    useAspectRatio: false,
  };
  const isAssetPlayerContent = useMemo(
    () => ['video', 'audio', 'pdf', 'image', 'bookmark', 'url', 'link'].includes(asset?.fileType),
    [asset?.fileType]
  );
  const previewUrl = asset?.providerData?.roleDetails?.previewUrl?.replace(
    ':id',
    asset?.providerData?.id
  );
  const handleOpenPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener');
    }
  };
  const handleOpenPdf = () => {
    if (isPDF) {
      window.open(`/protected/leebrary/play/${asset.id}`, '_blank', 'noopener,noreferrer');
    }
    if (isDocumentButNotPDF) {
      window.open(asset.url, '_blank', 'noopener');
    }
  };
  const isPDFOrGotAssetRole = assetRole || isPDF;

  const coverSource = useMemo(() => {
    const { fileType, url, original, cover } = asset;
    const fileIsAnImage = fileType === 'image';
    const isUrl = url && url.startsWith('http') && url.includes('unsplash');

    if (fileIsAnImage && isUrl) {
      return url;
    }

    if (original?.cover?.externalUrl) {
      return original.cover?.externalUrl;
    }
    return cover;
  }, [asset]);

  return (
    <Box className={classes.root} data-cypress-id="library-detail-player" onClick={handleOpenPdf}>
      <Box className={classes.color} />
      {isAssetPlayerContent ? (
        <AssetPlayer {...libraryProps} coverSource={coverSource} />
      ) : (
        <Box className={classes.activityContainer} onClick={() => handleOpenPreview()}>
          {isPDFOrGotAssetRole && (
            <Box className={classes.buttonIcon}>
              <ButtonIcon fileType="document" />
            </Box>
          )}
          {isDocumentButNotPDF && (
            <Box className={classes.buttonIcon}>
              <ButtonIcon fileType="file" />
            </Box>
          )}
          {coverSource ? (
            <ImageLoader src={coverSource} height={200} width={576} />
          ) : (
            <CardEmptyCover
              fileType={assetRole || 'file'}
              icon={asset?.fileIcon}
              height={199}
              width={576}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

AssetPlayerLibraryWrapper.defaultProps = ASSET_PLAYER_LIBRARY_WRAPPER_DEFAULT_PROPS;
AssetPlayerLibraryWrapper.propTypes = ASSET_PLAYER_LIBRARY_WRAPPER_PROP_TYPES;
AssetPlayerLibraryWrapper.displayName = 'AssetPlayerLibraryWrapper';
export { AssetPlayerLibraryWrapper };
