import React, { useEffect, useState } from 'react';
import { Box, CardEmptyCover, ImageLoader } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import loadable from '@loadable/component';
import { AssetPlayer } from './AssetPlayer/AssetPlayer';
import { ButtonIcon } from './AssetPlayer/components/ButtonIcon';

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/leebrary/${component}.js`)
  );
}
const AssetPlayerWrapper = ({ asset, category }) => {
  const [isCustomPlayer, setIsCustomPlayer] = useState(false);
  let Component = AssetPlayer;

  const getMultimediaProps = () => {
    if (asset?.fileType === 'audio') {
      return {
        useAudioCard: true,
      };
    }
    if (asset?.fileType === 'video') {
      return {
        width: 500,
        height: 'auto',
      };
    }
    if (asset?.fileType === 'pdf') {
      return {
        viewPDF: true,
      };
    }
    if (asset?.fileType === 'image') {
      return {
        width: 500,
        height: 'auto',
      };
    }
    return {};
  };
  const componentOwner = category?.componentOwner || category?.pluginOwner;
  if (category?.detailComponent && componentOwner) {
    try {
      Component = dynamicImport(componentOwner, category?.detailComponent);
      setIsCustomPlayer(true);
    } catch (e) {
      //
    }
  }
  const assetRole = asset?.providerData?.role;

  const fileExtension = asset?.fileExtension;
  const isAssetPlayerContent =
    ['video', 'audio', 'pdf', 'image', 'bookmark', 'url', 'link'].includes(asset?.fileType) ||
    fileExtension === 'pdf';
  const previewUrl = asset?.providerData?.roleDetails.previewUrl?.replace(
    ':id',
    asset?.providerData?.id
  );
  const handleOpenPreview = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank', 'noopener');
    }
  };

  return (
    <Box
      data-cypress-id="library-detail-player"
      style={{ display: 'grid', placeContent: 'center', width: '100%', height: '100vh' }}
    >
      <Box />
      {isAssetPlayerContent ? (
        <Component asset={asset} {...(!isCustomPlayer && getMultimediaProps())} />
      ) : (
        <Box onClick={() => handleOpenPreview()}>
          {assetRole && (
            <Box>
              <ButtonIcon fileType="document" />
            </Box>
          )}
          {asset?.cover ? (
            <ImageLoader src={asset?.cover} height={200} width={496} />
          ) : (
            <CardEmptyCover fileType={assetRole} icon={asset?.fileIcon} height={199} />
          )}
        </Box>
      )}
    </Box>
  );
};

AssetPlayerWrapper.propTypes = {
  asset: propTypes.object,
  viewPDF: propTypes.bool,
  detailMode: propTypes.bool,
  category: propTypes.object,
};

AssetPlayerWrapper.defaultProps = {
  asset: {},
  viewPDF: false,
  detailMode: false,
  category: {},
};

export { AssetPlayerWrapper };
