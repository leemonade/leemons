/* eslint-disable consistent-return */
import React from 'react';
import {
  LIBRARY_DETAIL_PLAYER_DEFAULT_PROPS,
  LIBRARY_DETAIL_PLAYER_PROP_TYPES,
} from './LibraryDetailPlayer.constants';
import { AssetPlayerLibraryWrapper } from './AssetPlayerLibraryWrapper';

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
  isEmbedded,
  id,
  original,
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
    providerData,
    color,
    id,
    original,
  };
  return <AssetPlayerLibraryWrapper asset={asset} />;
};

LibraryDetailPlayer.defaultProps = LIBRARY_DETAIL_PLAYER_DEFAULT_PROPS;
LibraryDetailPlayer.propTypes = LIBRARY_DETAIL_PLAYER_PROP_TYPES;

export default LibraryDetailPlayer;
export { LibraryDetailPlayer };
