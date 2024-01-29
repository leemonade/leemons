import React from 'react';
import {
  Box,
  createStyles,
  getFontExpressive,
  pxToRem,
  CardEmptyCover,
  ImageLoader,
} from '@bubbles-ui/components';
import propTypes from 'prop-types';
import loadable from '@loadable/component';
import { AssetPlayer } from './AssetPlayer/AssetPlayer';
import { ButtonIcon } from './AssetPlayer/components/ButtonIcon';

const AssetPlayerWrapperStyles = createStyles((theme, { color, assetRole }) => ({
  root: {
    ...getFontExpressive(theme.fontSizes['2']),
  },
  color: {
    backgroundColor: color,
    height: pxToRem(4),
    width: '100%',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'baseline',
    padding: `${pxToRem(16)} ${pxToRem(16)} ${pxToRem(10)} ${pxToRem(16)}`,
    gap: pxToRem(16),
    backgroundColor: theme.colors.mainWhite,
  },
  title: {
    fontWeight: 600,
    flex: 1,
  },
  buttonIcon: {
    position: 'absolute',
    zIndex: 10,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
  },
  activityContainer: {
    width: 496,
    height: 200,
    position: 'relative',
    cursor: assetRole ? 'pointer' : 'no-drop',
  },
}));

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/leebrary/${component}.js`)
  );
}
const AssetPlayerWrapper = ({ asset, viewPDF, detailMode, category }) => {
  let Component = AssetPlayer;
  let modeProps;
  const componentOwner = category?.componentOwner || category?.pluginOwner;
  if (category?.detailComponent && componentOwner) {
    try {
      Component = dynamicImport(componentOwner, category?.detailComponent);
    } catch (e) {
      //
    }
  }
  if (detailMode) {
    modeProps = {
      height: 200,
      width: 496,
      asset,
      hideURLInfo: true,
      viewPDF,
      compact: true,
      useAspectRatio: false,
    };
  }

  const assetRole = asset?.providerData?.role;
  const { classes } = AssetPlayerWrapperStyles(
    { color: asset?.color, assetRole },
    { name: 'LibraryDetailPlayer' }
  );
  const fileExtension = asset?.fileExtension;
  const isAssetPlayerContent =
    ['video', 'audio', 'pdf', 'image', 'bookmark', 'url', 'link'].includes(asset?.fileType) ||
    fileExtension === 'pdf';
  const previewUrl = asset?.providerData?.roleDetails.previewUrl?.replace(
    ':id',
    asset?.providerData?.id
  );
  const handleOpenPreview = () => {
    if (!previewUrl) {
      return;
    }
    return window.open(previewUrl, '_blank', 'noopener');
  };
  return (
    <Box className={classes.root} data-cypress-id="library-detail-player">
      <Box className={classes.color} />
      {isAssetPlayerContent ? (
        <Component {...modeProps} />
      ) : (
        <Box className={classes.activityContainer} onClick={() => handleOpenPreview()}>
          {assetRole && (
            <Box className={classes.buttonIcon}>
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
