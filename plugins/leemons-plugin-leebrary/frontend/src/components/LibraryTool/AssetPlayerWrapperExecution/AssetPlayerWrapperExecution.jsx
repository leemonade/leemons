import React, { useMemo } from 'react';
import { AssetPlayer } from '@leebrary/components/AssetPlayer';
import { Box, LoadingOverlay } from '@bubbles-ui/components';
import {
  ASSET_PLAYER_WRAPPER_EXECUTION_DEFAULT_PROPS,
  ASSET_PLAYER_WRAPPER_EXECUTION_PROPTYPES,
} from './AssetPlayerWrapperExecution.constants';
import { LibraryCardCC } from '../../LibraryCardCC';

const AssetPlayerWrapperExecution = ({ asset, showPlayButton }) => {
  const executionProps = {
    asset,
    width: '100%',
    showPlayButton,
    execMode: true,
  };

  const isAssetPlayerContent = useMemo(
    () => ['video', 'audio', 'pdf', 'image'].includes(asset?.fileType),
    [asset?.fileType]
  );

  const isPlayableContent = useMemo(
    () =>
      isAssetPlayerContent || (asset?.fileType === 'document' && asset?.fileExtension === 'pdf'),
    [asset, isAssetPlayerContent]
  );

  if (asset?.fileType === 'audio') {
    executionProps.useAudioCard = true;
  }

  const renderContent = () => {
    if (!asset) {
      return null;
    }

    if (isPlayableContent && asset.fileType) {
      return <AssetPlayer {...executionProps} />;
    }

    return <LibraryCardCC asset={asset} canPlay />;
  };

  return (
    <Box
      data-cypress-id="execution-detail-player"
      style={{
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      <LoadingOverlay visible={!asset} />
      {renderContent()}
    </Box>
  );
};

AssetPlayerWrapperExecution.defaultProps = ASSET_PLAYER_WRAPPER_EXECUTION_DEFAULT_PROPS;
AssetPlayerWrapperExecution.propTypes = ASSET_PLAYER_WRAPPER_EXECUTION_PROPTYPES;
AssetPlayerWrapperExecution.displayName = 'AssetPlayerWrapperExecution';
export { AssetPlayerWrapperExecution };
