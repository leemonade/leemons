import React from 'react';
import { Box, ImageLoader, CardEmptyCover } from '@bubbles-ui/components';
import { ButtonIcon } from '@leebrary/components/AssetPlayer/components/ButtonIcon';
import { AssetPlayer } from '@leebrary/components/AssetPlayer';
import { AssetPlayerLibraryWrapperStyles } from './AssetPlayerLibraryWrapper.styles';
import {
  ASSET_PLAYER_LIBRARY_WRAPPER_DEFAULT_PROPS,
  ASSET_PLAYER_LIBRARY_WRAPPER_PROP_TYPES,
} from './AssetPlayerLibraryWrapper.constants';

const AssetPlayerLibraryWrapper = ({ asset }) => {
  const assetRole = asset?.providerData?.role;
  const fileExtension = asset?.fileExtension;
  const isPDF = fileExtension === 'pdf';

  const { classes } = AssetPlayerLibraryWrapperStyles(
    { color: asset?.color, assetRole, isPDF },
    { name: 'LibraryDetailPlayer' }
  );
  const libraryProps = {
    height: 200,
    width: 496,
    asset,
    hideURLInfo: true,
    viewPDF: false,
    compact: true,
    useAspectRatio: false,
  };
  const isAssetPlayerContent = [
    'video',
    'audio',
    'pdf',
    'image',
    'bookmark',
    'url',
    'link',
  ].includes(asset?.fileType);
  const previewUrl = asset?.providerData?.roleDetails.previewUrl?.replace(
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
      window.open('https://google.com', '_blank', 'noopener');
    }
  };
  const isPDFOrGotAssetRole = assetRole || isPDF;
  return (
    <Box className={classes.root} data-cypress-id="library-detail-player" onClick={handleOpenPdf}>
      <Box className={classes.color} />
      {isAssetPlayerContent ? (
        <AssetPlayer {...libraryProps} />
      ) : (
        <Box className={classes.activityContainer} onClick={() => handleOpenPreview()}>
          {isPDFOrGotAssetRole && (
            <Box className={classes.buttonIcon}>
              <ButtonIcon fileType="document" />
            </Box>
          )}
          {asset?.cover ? (
            <ImageLoader src={asset?.cover} height={200} width={496} />
          ) : (
            <CardEmptyCover fileType={assetRole || 'file'} icon={asset?.fileIcon} height={199} />
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
