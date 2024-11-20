import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import { TLayout, Stack, Button } from '@bubbles-ui/components';
import { ChevLeftIcon } from '@bubbles-ui/icons/outline';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import propTypes from 'prop-types';

import { AssetsTable } from './components/AssetsTable';
import { BulkActions } from './components/BulkActions';
import { Filters } from './components/Filters';
import { TableEmptyState } from './components/TableEmptyState';
import { BulkEditDrawer } from './components/drawers/BulkEditDrawer';
import { BulkShareDrawer } from './components/drawers/BulkShareDrawer';

import getResourceTypeDisplay from '@leebrary/helpers/getResourceTypeDisplay';
import useBulkAssetsColumns from '@leebrary/hooks/useBulkAssetsColumns';
import { updateAssetRequest } from '@leebrary/request';

const ManageBulkAssets = ({ initialData, assets: initialAssets, onAssetsUpdate, t }) => {
  const history = useHistory();
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isShareDrawerOpen, setIsShareDrawerOpen] = useState(false);
  const [filteredAssets, setFilteredAssets] = useState(initialData || initialAssets);
  const [search, setSearch] = useState('');
  const {
    control,
    handleSubmit,
    reset,
    setValue: setEditValue,
  } = useForm({
    defaultValues: {
      cover: null,
      subjects: [],
      tags: [],
      color: null,
    },
  });

  useEffect(() => {
    handleFiltersChange({});
  }, [initialData]);

  const parseAssetsWithValues = (selectedAssetIds, values) => {
    return assets.map((asset) => {
      if (!selectedAssetIds.includes(asset.id)) {
        return asset;
      }

      const isImage = asset?.file?.type?.includes('image');
      const newValues = isImage ? { ...values, cover: asset.cover } : values;

      return {
        ...asset,
        ...newValues,
        published: true,
      };
    });
  };
  const handleEditSave = handleSubmit(async (data) => {
    try {
      const preparedAssets = parseAssetsWithValues(selectedAssets, data);
      let updatedAssets = [...assets];

      for (const assetId of selectedAssets) {
        const assetToUpdate = preparedAssets.find((asset) => asset.id === assetId);
        const updatedAsset = await updateAssetRequest(
          assetToUpdate,
          assetToUpdate.category,
          'media-files'
        );

        updatedAssets = updatedAssets.map((asset) =>
          asset.id === updatedAsset.id ? { ...updatedAsset } : asset
        );
      }

      setAssets(updatedAssets);
      addSuccessAlert(t('assetsUpdatedSuccess'));
      if (onAssetsUpdate) {
        onAssetsUpdate(updatedAssets);
      }

      setIsEditDrawerOpen(false);
      reset();
      setSelectedAssets([]);
    } catch (error) {
      console.error(t('assetsUpdateError'), error);
      addErrorAlert(t('assetsUpdateError'));
    }
  });

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedAssets(assets.map((asset) => asset.id));
    } else {
      setSelectedAssets([]);
    }
  };

  const handleSelectRow = (assetId, checked) => {
    if (checked) {
      setSelectedAssets([...selectedAssets, assetId]);
    } else {
      setSelectedAssets(selectedAssets.filter((id) => id !== assetId));
    }
  };

  const columns = useBulkAssetsColumns({
    selectedAssets,
    onSelectAll: handleSelectAll,
    onSelectRow: handleSelectRow,
    assets,
    t,
  });

  const areAllAssetsSelectedImages = assets.every((asset) => asset?.file?.type.includes('image'));

  const handlePermissionsUpdate = (updatedAssets) => {
    const newAssets = assets.map((asset) => {
      const updatedAsset = updatedAssets.find((updated) => updated.id === asset.id);
      return updatedAsset || asset;
    });

    setAssets(newAssets);
    if (onAssetsUpdate) {
      onAssetsUpdate(newAssets);
    }
  };

  const handleFiltersChange = ({ search, type, subject, tags }) => {
    setSearch(search);
    let filtered = initialData || initialAssets;

    if (search) {
      filtered = filtered.filter((asset) =>
        asset.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type && type !== 'all') {
      filtered = filtered.filter((asset) => {
        const { displayLabel } = getResourceTypeDisplay(asset);
        return displayLabel === type;
      });
    }

    if (subject) {
      filtered = filtered.filter((asset) =>
        asset.subjects?.some((sub) => sub.subject === subject[0])
      );
    }

    if (tags?.length) {
      filtered = filtered.filter((asset) => asset.tags?.includes(tags));
    }
    setFilteredAssets(filtered);
  };

  return (
    <TLayout.Content
      TopZone={
        <Stack mt={16} mb={16}>
          <Button variant="linkInline" leftIcon={<ChevLeftIcon />} onClick={() => history.goBack()}>
            {t('backToLibraryLabel')}
          </Button>
        </Stack>
      }
    >
      <Filters assets={initialData || initialAssets} onFiltersChange={handleFiltersChange} t={t} />
      <BulkActions
        onEdit={() => setIsEditDrawerOpen(true)}
        onShare={() => setIsShareDrawerOpen(true)}
        disabled={!selectedAssets.length}
        t={t}
      />
      {filteredAssets.length >= 1 ? (
        <AssetsTable data={filteredAssets} columns={columns} />
      ) : (
        <TableEmptyState query={search} t={t} />
      )}
      <BulkEditDrawer
        isOpen={isEditDrawerOpen}
        onClose={() => {
          setIsEditDrawerOpen(false);
          reset();
        }}
        t={t}
        onSave={handleEditSave}
        control={control}
        setValue={setEditValue}
        areAllImagesSelected={areAllAssetsSelectedImages}
        initialData={initialData}
        selectedAssets={
          initialData?.filter((asset) => selectedAssets.includes(asset.id)) ||
          assets.filter((asset) => selectedAssets.includes(asset.id))
        }
      />
      <BulkShareDrawer
        isOpen={isShareDrawerOpen}
        onClose={() => setIsShareDrawerOpen(false)}
        selectedAssets={
          initialData?.filter((asset) => selectedAssets.includes(asset.id)) ||
          assets.filter((asset) => selectedAssets.includes(asset.id))
        }
        onAssetsUpdate={handlePermissionsUpdate}
        t={t}
      />
    </TLayout.Content>
  );
};

ManageBulkAssets.propTypes = {
  assets: propTypes.array,
  onAssetsUpdate: propTypes.func,
  initialData: propTypes.array,
  t: propTypes.func,
};

export { ManageBulkAssets };
