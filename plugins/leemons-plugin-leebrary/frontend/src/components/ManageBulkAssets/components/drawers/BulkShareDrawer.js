import { Alert, Text } from '@bubbles-ui/components';
import PropTypes from 'prop-types';

import { PermissionsDataDrawer } from '@leebrary/components/AssetSetup';
import { setPermissionsRequest } from '@leebrary/request';

const BulkShareDrawer = ({ isOpen, onClose, selectedAssets = [], onAssetsUpdate, t }) => {
  const getAssetForPermissions = () => {
    if (!selectedAssets?.length) return null;

    if (selectedAssets.length === 1) {
      return selectedAssets[0];
    }

    const firstAssetCanAccess = selectedAssets[0]?.canAccess || [];
    const allHaveSamePermissions = selectedAssets.every((asset) => {
      const currentCanAccess = asset?.canAccess || [];
      return (
        currentCanAccess.length === firstAssetCanAccess.length &&
        currentCanAccess.every(
          (access, index) => JSON.stringify(access) === JSON.stringify(firstAssetCanAccess[index])
        )
      );
    });

    if (allHaveSamePermissions) {
      return selectedAssets[0];
    }

    return {
      ...selectedAssets[0],
      canAccess: [{ permissions: ['owner'] }],
    };
  };

  const asset = getAssetForPermissions();

  const handleSavePermissions = async (assetId, onSend) => {
    await setPermissionsRequest(assetId, onSend);
    const updatedAssets = selectedAssets.map((asset) => {
      if (asset.id === assetId) {
        return {
          ...asset,
          canAccess: onSend.canAccess,
          permissions: onSend.permissions,
          isPublic: onSend.isPublic,
        };
      }
      return asset;
    });

    if (onAssetsUpdate) {
      onAssetsUpdate([...selectedAssets, ...updatedAssets]);
    }
    onClose();
  };
  const isOnlyOneSelectedAsset = selectedAssets.length === 1;

  return (
    <PermissionsDataDrawer
      opened={isOpen}
      onClose={onClose}
      asset={isOnlyOneSelectedAsset ? asset : null}
      assets={isOnlyOneSelectedAsset ? [] : selectedAssets}
      sharing={true}
      isBulk={true}
      onSavePermissions={handleSavePermissions}
      header={
        selectedAssets.length > 1 && (
          <Alert closeable={false}>
            <Text>
              {t('bulkShareDrawer.alertPartOne')}
              <Text strong>{t('bulkShareDrawer.alertPartTwo')}</Text>
            </Text>
          </Alert>
        )
      }
    />
  );
};

BulkShareDrawer.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  selectedAssets: PropTypes.array,
  onAssetsUpdate: PropTypes.func,
  t: PropTypes.func,
};

export { BulkShareDrawer };
