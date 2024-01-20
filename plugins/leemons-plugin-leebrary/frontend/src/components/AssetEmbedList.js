import React, { useEffect } from 'react';
import { Box, createStyles } from '@bubbles-ui/components';
import { useAssets } from '@leebrary/request/hooks/queries/useAssets';
import propTypes from 'prop-types';
import useCategories from '@leebrary/request/hooks/queries/useCategories';
import { CardWrapper } from './CardWrapper';

const useStyles = createStyles((theme, { width }) => ({
  root: {
    width,
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    borderBottom: `1px solid ${theme.other.divider.background.color.default}`,
    minHeight: 66,
  },
}));

const AssetEmbedList = ({ assignation, width }) => {
  const [assetIds, setAssetIds] = React.useState([]);

  const { data: assetsData, isLoading } = useAssets({
    ids: assetIds,
    filters: {
      showPublic: true,
      indexable: false,
    },
    enabled: assetIds.length > 0,
  });
  const { data: categoriesData } = useCategories();

  const { classes } = useStyles({ width }, { name: 'AssetEmbedList' });

  function pickAsset(assetId) {
    return assetsData?.find((asset) => asset.id === assetId) || {};
  }

  useEffect(() => {
    if (assignation?.instance?.assignable?.resources) {
      setAssetIds(assignation?.instance?.assignable?.resources);
    }
  }, [assignation]);

  return (
    <Box className={classes.root}>
      {assetIds.length > 0
        ? assetIds.map((assetId) => (
            <Box className={classes.item} key={assetId}>
              <CardWrapper
                {...pickAsset(assetId)}
                isEmbedded={true}
                item={pickAsset(assetId)}
                category={
                  categoriesData?.find(
                    (category) => category.id === pickAsset(assetId).category
                  ) || {
                    key: 'media-file',
                  }
                }
                isCreationPreview={false}
                isEmbeddedList={true}
                variant={'embedded'}
                assetsLoading={isLoading}
              />
            </Box>
          ))
        : null}
    </Box>
  );
};

AssetEmbedList.propTypes = {
  assignation: propTypes.object,
  width: propTypes.number,
};
AssetEmbedList.defaultProps = {
  assignation: {},
  width: 440,
};

export { AssetEmbedList };
