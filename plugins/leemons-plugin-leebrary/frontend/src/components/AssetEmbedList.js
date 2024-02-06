/* eslint-disable prettier/prettier */
import React, { useEffect, useState, useMemo } from 'react';
import { Box, createStyles, Drawer } from '@bubbles-ui/components';
import { useAssets } from '@leebrary/request/hooks/queries/useAssets';
import propTypes from 'prop-types';
import useCategories from '@leebrary/request/hooks/queries/useCategories';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { isEmpty } from 'lodash';
import { unflatten } from '@common';
import { useSession } from '@users/session';
import { CardWrapper } from './CardWrapper';
import { CardDetailWrapper } from './CardDetailWrapper';
import prefixPN from '../helpers/prefixPN';

function getLocale(session) {
  return session ? session.locale : navigator?.language || 'en';
}

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

const AssetEmbedList = ({ assets, width }) => {
  const [assetIds, setAssetIds] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [t, translations] = useTranslateLoader(prefixPN('list'));
  const session = useSession();
  const locale = getLocale(session);


  const detailLabels = useMemo(() => {
    if (!isEmpty(translations)) {
      const items = unflatten(translations.items);
      return items.leebrary.list.labels;
    }
    return {};
  }, [JSON.stringify(translations)]);

  const toolbarItems = useMemo(
    () => ({
      download: selectedAsset?.downloadable ? t('cardToolbar.download') : false,
    }),
    [selectedAsset, t]
  );
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
  const handleOnSelect = (item) => {
    setSelectedAsset(item);
    setIsDrawerOpen(true);
  };
  useEffect(() => {
    if (assets?.length) {
      setAssetIds(assets);
    }
  }, [assets]);
  function handleOnDownload(item) {
    window.open(item.url, '_blank', 'noopener');
  }
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
              onClick={() => handleOnSelect(pickAsset(assetId))}
            />
          </Box>
        ))
        : null}
      <Box
        sx={() => ({
          position: 'fixed',
          right: 0,
          zIndex: 99,
        })}
      >
        <Drawer
          opened={isDrawerOpen}
          size="496px"
          close={false}
          empty={true}
          className={{
            root: { borderRadius: 0, border: 'none !important' },
            body: { borderRadius: 0, border: 'none !important' },
          }}
        >
          <CardDetailWrapper
            category={
              categoriesData?.find(
                (category) => category.id === pickAsset(selectedAsset?.id).category
              ) || {
                key: 'media-file',
              }
            }
            asset={selectedAsset}
            labels={detailLabels}
            variant={'embedded'}
            open={isDrawerOpen}
            toolbarItems={toolbarItems}
            onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
            onDownload={handleOnDownload}
            onCloseDrawer={() => {
              setIsDrawerOpen(false);
            }}
            onOpenDrawer={() => setIsDrawerOpen(true)}
            locale={locale}
          />
        </Drawer>
      </Box>
    </Box>
  );
};

AssetEmbedList.propTypes = {
  assets: propTypes.arrayOf(propTypes.string),
  width: propTypes.number,
};
AssetEmbedList.defaultProps = {
  assets: [],
  width: 440,
};

export { AssetEmbedList };
