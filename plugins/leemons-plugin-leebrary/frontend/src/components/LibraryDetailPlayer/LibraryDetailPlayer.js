/* eslint-disable consistent-return */
import React from 'react';
import { Box, ImageLoader, CardEmptyCover } from '@bubbles-ui/components';
import { LibraryDetailPlayerStyles } from './LibraryDetailPlayer.styles';
import {
  LIBRARY_DETAIL_PLAYER_DEFAULT_PROPS,
  LIBRARY_DETAIL_PLAYER_PROP_TYPES,
} from './LibraryDetailPlayer.constants';
import { AssetPlayer } from '../AssetPlayer';
import { ButtonIcon } from '../AssetPlayer/components/ButtonIcon';

const LibraryDetailPlayer = ({
  name,
  height,
  cover,
  url,
  color,
  variant,
  metadata,
  fileIcon,
  fileType,
  fileExtension,
  titleActionButton,
  providerData,
  ...props
}) => {
  const asset = {
    name,
    cover,
    fileIcon,
    fileType,
    fileExtension,
    metadata,
    url,
  };
  const assetRole = providerData?.role;
  const isAssetPlayerContent =
    ['video', 'audio', 'pdf', 'image', 'bookmark', 'url', 'link'].includes(asset?.fileType) ||
    fileExtension === 'pdf';
  const previewUrl = providerData?.roleDetails.previewUrl?.replace(':id', providerData?.id);
  const handleOpenPreview = () => {
    if (!previewUrl) {
      return;
    }
    return window.open(previewUrl, '_blank', 'noopener');
  };

  const { classes } = LibraryDetailPlayerStyles(
    { color, assetRole },
    { name: 'LibraryDetailPlayer' }
  );
  return (
    <Box className={classes.root} data-cypress-id="library-detail-player">
      <Box className={classes.color} />
      {isAssetPlayerContent ? (
        <AssetPlayer
          height={200}
          width={496}
          asset={asset}
          hideURLInfo
          viewPDF={false}
          compact
          useAspectRatio={false}
        />
      ) : (
        <Box className={classes.activityContainer} onClick={() => handleOpenPreview()}>
          {assetRole && (
            <Box className={classes.buttonIcon}>
              <ButtonIcon fileType="document" />
            </Box>
          )}
          {cover ? (
            <ImageLoader src={cover} height={200} width={496} />
          ) : (
            <CardEmptyCover fileType={assetRole} icon={fileIcon} height={199} />
          )}
        </Box>
      )}
    </Box>
  );
};

LibraryDetailPlayer.defaultProps = LIBRARY_DETAIL_PLAYER_DEFAULT_PROPS;
LibraryDetailPlayer.propTypes = LIBRARY_DETAIL_PLAYER_PROP_TYPES;

export default LibraryDetailPlayer;
export { LibraryDetailPlayer };
