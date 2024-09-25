import React, { useMemo } from 'react';

import { Box } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import propTypes from 'prop-types';

import { AssetPlayer } from './AssetPlayer/AssetPlayer';

function dynamicImport(pluginName, component) {
  return loadable(() => import(`@app/plugins/${pluginName}/src/widgets/leebrary/${component}.js`));
}
const AssetPlayerWrapper = ({ asset, category }) => {
  const getMultimediaProps = () => {
    if (asset?.fileType === 'audio') {
      return {
        useAudioCard: true,
      };
    }
    if (asset?.fileType === 'video') {
      return {
        width: 720,
        height: 'auto',
      };
    }
    if (asset?.fileType === 'pdf') {
      return {
        viewPDF: true,
        width: '100%',
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

  const Component = useMemo(() => {
    let componentToRender = AssetPlayer;
    const componentOwner = category?.componentOwner || category?.pluginOwner;
    if (componentOwner !== 'leebrary' && category?.playerComponent && componentOwner) {
      try {
        componentToRender = dynamicImport(componentOwner, category.playerComponent);
      } catch (e) {
        //
      }
    }

    return componentToRender;
  }, [category]);

  return (
    <Box
      data-cypress-id="library-detail-player"
      style={{
        display: 'grid',
        placeContent: 'center',
        width: '100%',
        minHeight: '100vh',
      }}
    >
      <Component asset={asset} {...getMultimediaProps()} execMode />
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
