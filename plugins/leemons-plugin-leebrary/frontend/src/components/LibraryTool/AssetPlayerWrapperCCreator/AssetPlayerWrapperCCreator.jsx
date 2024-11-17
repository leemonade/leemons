import React from 'react';
import { AssetPlayer } from '@leebrary/components/AssetPlayer';
import {
  ASSET_PLAYER_WRAPPER_CCREATOR_DEFAULT_PROPS,
  ASSET_PLAYER_WRAPPER_CCREATOR_PROP_TYPES,
} from './AssetPlayerWrapperCCreator.constants';

const AssetPlayerWrapperCCreator = ({
  asset,
  width,
  framed,
  canPlay,
  showPlayButton,
  useAudioCard,
}) => {
  const CCreatorProps = {
    asset,
    width,
    framed,
    canPlay: false,
    showPlayButton,
    useAudioCard,
    ccMode: true,
  };
  if (asset?.fileType === 'video') {
    CCreatorProps.compact = true;
    CCreatorProps.useAspectRatio = true;
  }
  return <AssetPlayer {...CCreatorProps} />;
};

AssetPlayerWrapperCCreator.defaultProps = ASSET_PLAYER_WRAPPER_CCREATOR_DEFAULT_PROPS;
AssetPlayerWrapperCCreator.propTypes = ASSET_PLAYER_WRAPPER_CCREATOR_PROP_TYPES;
AssetPlayerWrapperCCreator.displayName = 'AssetPlayerWrapperCCreator';
export { AssetPlayerWrapperCCreator };
