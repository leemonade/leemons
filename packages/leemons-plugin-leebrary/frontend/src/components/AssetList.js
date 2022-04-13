import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, find, isString } from 'lodash';
import {
  Box,
  Stack,
  Paper,
  SearchInput,
  PaginatedList,
  Title,
  LoadingOverlay,
  useResizeObserver,
} from '@bubbles-ui/components';
import { LibraryDetail } from '@bubbles-ui/leemons';
import { CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import prefixPN from '../helpers/prefixPN';
import { getAssetsRequest, getAssetsByIdsRequest, listCategoriesRequest } from '../request';
import { getPageItems } from '../helpers/getPageItems';
import { CardWrapper } from './CardWrapper';
import { prepareAsset } from '../helpers/prepareAsset';

const AssetList = ({
  category: categoryProp,
  categories: categoriesProp,
  asset: assetProp,
  layout,
  itemMinWidth,
  onItemClick = () => {},
}) => {
  const [t] = useTranslateLoader(prefixPN('list'));
  const [category, setCategory] = useState(categoryProp);
  const [categories, setCategories] = useState(categoriesProp);
  const [asset, setAsset] = useState(assetProp);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [assets, setAssets] = useState([]);
  const [openDetail, setOpenDetail] = useState(true);
  const [serverData, setServerData] = useState({});
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const [containerRef, containerRect] = useResizeObserver();
  const [childRef, childRect] = useResizeObserver();
  const [drawerRef, drawerRect] = useResizeObserver();

  // ·········································································
  // DATA PROCESSING

  const loadCategories = async (selectedCategoryKey) => {
    const result = await listCategoriesRequest();
    const items = result.map((data) => ({
      ...data,
      icon: data.menuItem.iconSvg,
      name: data.menuItem.label,
    }));
    setCategories(items);
    if (!isEmpty(selectedCategoryKey)) {
      setCategory(find(items, { key: selectedCategoryKey }));
    }
  };

  const loadAssets = async (categoryId) => {
    console.log('loadAssets > categoryId:', categoryId);
    try {
      setLoading(true);
      const response = await getAssetsRequest({ category: categoryId });
      setAssets(response?.assets || []);
      setTimeout(() => setLoading(false), 1000);
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  const loadAssetsData = async () => {
    console.log('loadAssetsData');
    try {
      setLoading(true);
      if (!isEmpty(assets)) {
        const paginated = getPageItems({ data: assets, page: page - 1, size });
        const assetIds = paginated.items.map((item) => item.asset);
        const response = await getAssetsByIdsRequest(assetIds);
        paginated.items = response.assets || [];
        setServerData(paginated);
      } else {
        setServerData([]);
      }
      setTimeout(() => setLoading(false), 1000);
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  const loadAsset = async (id) => {
    console.log('loadAsset > id:', id);
    try {
      const item = find(serverData.items, { id });
      if (item) {
        console.log(prepareAsset(item));
        setAsset(prepareAsset(item));
      } else {
        const response = await getAssetsByIdsRequest([id]);
        console.log('response:', response);
        if (!isEmpty(response?.assets)) {
          setAsset(prepareAsset(response.assets[0]));
        } else {
          setAsset(null);
        }
      }
    } catch (err) {
      addErrorAlert(getErrorMessage(err));
    }
  };

  // ·········································································
  // EFFECTS

  useEffect(() => setCategories(categoriesProp), [categoriesProp]);

  useEffect(() => {
    if (!isEmpty(assetProp?.id)) {
      setAsset(assetProp);
    } else if (isString(assetProp)) {
      loadAsset(assetProp);
    }
  }, [assetProp]);

  useEffect(() => {
    if (!isEmpty(categoryProp?.id)) {
      setCategory(categoryProp);
    } else if (isString(categoryProp) && isEmpty(categories)) {
      loadCategories(categoryProp);
    } else if (isString(categoryProp) && !isEmpty(categories)) {
      setCategory(find(categories, { key: categoryProp }));
    }
  }, [categoryProp, categories]);

  useEffect(() => {
    if (!isEmpty(category?.id)) {
      loadAssets(category.id);
    }
  }, [category]);

  useEffect(() => {
    loadAssetsData();
  }, [assets, page, size]);

  // ·········································································
  // HANDLERS

  const handleOnCardClick = (item) => {
    setOpenDetail(true);
    onItemClick(item);
  };

  const handleOnCardDelete = (item) => {
    console.log(item);
  };

  // ·········································································
  // LABELS & STATIC

  const columns = [
    {
      Header: 'Name',
      accessor: 'name',
    },
    {
      Header: 'Owner',
      accessor: 'owner',
    },
    {
      Header: 'Last change',
      accessor: 'updated',
    },
  ];

  const cardVariant = useMemo(() => {
    let variant = 'media';
    switch (category?.key) {
      case 'bookmarks':
        variant = 'bookmark';
        break;
      default:
        break;
    }
    return variant;
  }, [category]);

  const showDrawer = useMemo(() => !loading && !isEmpty(asset), [loading, asset]);

  const headerOffset = useMemo(() => Math.round(childRect.bottom + childRect.top), [childRect]);

  // ·········································································
  // RENDER

  return (
    <Stack ref={containerRef} direction="column" fullHeight style={{ position: 'relative' }}>
      <Paper
        ref={childRef}
        shadow="none"
        radius="none"
        skipFlex
        style={{
          width: containerRect.width,
          top: containerRect.top,
          position: 'fixed',
          zIndex: 999,
        }}
      >
        <SearchInput variant="filled" />
      </Paper>
      <Stack
        fullHeight
        style={{
          marginTop: headerOffset,
          marginRight: drawerRect.width,
        }}
      >
        <Box
          sx={(theme) => ({
            flex: 1,
            position: 'relative',
            paddingRight: theme.spacing[5],
            paddingLeft: theme.spacing[5],
          })}
        >
          <LoadingOverlay visible={loading} />
          {!loading && !isEmpty(serverData?.items) && (
            <Box
              sx={(theme) => ({
                paddingBottom: theme.spacing[5],
              })}
            >
              <PaginatedList
                {...serverData}
                margin={16}
                spacing={4}
                paperProps={{ shadow: 'none', padding: 0 }}
                itemRender={(p) => (
                  <CardWrapper
                    {...p}
                    variant={cardVariant}
                    onClick={handleOnCardClick}
                    onDelete={handleOnCardDelete}
                  />
                )}
                itemMinWidth={itemMinWidth}
                columns={columns}
                loading={loading}
                layout={layout}
                onPageChange={setPage}
                onSizeChange={setSize}
              />
            </Box>
          )}
          {!loading && isEmpty(serverData?.items) && (
            <Stack justifyContent="center" alignItems="center" fullWidth fullHeight>
              <Stack
                alignItems="center"
                direction="column"
                spacing={2}
                sx={(theme) => ({ color: theme.colors.text05 })}
              >
                <CommonFileSearchIcon style={{ fontSize: 24 }} />
                <Title order={4} color="soft">
                  No assets found
                </Title>
              </Stack>
            </Stack>
          )}
        </Box>
      </Stack>
      <Box
        ref={drawerRef}
        style={{
          position: 'fixed',
          height: `calc(100% - ${headerOffset}px)`,
          right: 0,
          top: headerOffset,
          zIndex: 999,
        }}
      >
        {showDrawer && (
          <Box style={{ background: '#FFF', maxWidth: openDetail ? 360 : 'auto', height: '100%' }}>
            <LibraryDetail
              asset={asset}
              variant={cardVariant}
              open={openDetail}
              onToggle={() => setOpenDetail(!openDetail)}
            />
          </Box>
        )}
      </Box>
    </Stack>
  );
};

AssetList.defaultProps = {
  layout: 'grid',
  searchable: true,
  category: 'media-files',
  categories: [],
  itemMinWidth: 340,
};
AssetList.propTypes = {
  category: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  layout: PropTypes.oneOf(['grid', 'list']),
  searchable: PropTypes.bool,
  asset: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  categories: PropTypes.arrayOf(PropTypes.object),
  onItemClick: PropTypes.func,
  itemMinWidth: PropTypes.number,
};

export { AssetList };
export default AssetList;
