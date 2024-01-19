import React, { useEffect } from 'react';
import { getAssetsByIdsRequest } from '@leebrary/request';
import prepareAsset from '@leebrary/helpers/prepareAsset';
import { useAssetListStore } from '@leebrary/hooks/useAssetListStore';
import { Box } from '@bubbles-ui/components';
import propTypes from 'prop-types';
import useCategories from '@leebrary/request/hooks/queries/useCategories';
import { CardWrapper } from './CardWrapper';

const AssetEmbedList = ({ assignation }) => {
  const initialState = {
    assets: [],
  };
  const [store, setStoreValue] = useAssetListStore(initialState);

  async function getResources(ids) {
    setStoreValue('isAssetsLoading', true);
    const response = await getAssetsByIdsRequest(ids, { showPublic: true, indexable: 0 });

    const preparedData = response?.assets?.map((asset) => prepareAsset(asset));
    setStoreValue('assets', preparedData);
    if (Array.isArray(preparedData)) {
      setStoreValue('isAssetsLoading', false);
    }
  }
  const { data: categoriesData } = useCategories();

  useEffect(() => {
    getResources(assignation?.instance?.assignable?.resources);
  }, [assignation]);
  useEffect(() => {
    if (categoriesData) {
      setStoreValue('categories', categoriesData);
    }
  }, [categoriesData]);

  return (
    <Box>
      {!!store?.assets?.length &&
        store.assets.map((asset) => (
          <CardWrapper
            {...asset}
            isEmbedded={true}
            item={asset}
            key={asset.id}
            category={
              store.categories.find((category) => category.id === asset.category) || {
                key: 'media-file',
              }
            }
            isCreationPreview={false}
            isEmbeddedList={true}
            variant={'embedded'}
            assetsLoading={store.isAssetsLoading}
          />
        ))}
    </Box>
  );
};

AssetEmbedList.propTypes = {
  assignation: propTypes.object,
};
AssetEmbedList.defaultProps = {
  assignation: {},
};

export { AssetEmbedList };
