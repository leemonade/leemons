/* eslint-disable no-unreachable */
import React, { useEffect, useMemo, useState, useContext, useCallback } from 'react';
import { isEmpty, find } from 'lodash';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import {
  Box,
  Stack,
  Paper,
  SearchInput,
  PaginatedList,
  Title,
  LoadingOverlay,
} from '@bubbles-ui/components';
import { LibraryDetail } from '@bubbles-ui/leemons';
import { CommonFileSearchIcon } from '@bubbles-ui/icons/outline';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import prefixPN from '../../../helpers/prefixPN';
import { getAssetsRequest, getAssetsByIdsRequest } from '../../../request';
import LibraryContext from '../../../context/LibraryContext';
import { VIEWS } from '../library/Library.constants';
import { getPageItems } from '../../../helpers/getPageItems';
import { CardWrapper } from '../../../components/CardWrapper';
import { prepareAsset } from '../../../helpers/prepareAsset';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const ListAssetPage = () => {
  const { file, setView, view, category, selectCategory, setAsset, asset } =
    useContext(LibraryContext);
  const [t] = useTranslateLoader(prefixPN('list'));
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [assets, setAssets] = useState([]);
  const [serverData, setServerData] = useState({});
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const history = useHistory();
  const params = useParams();
  const query = useQuery();
  const location = useLocation();

  // ·········································································
  // DATA PROCESSING

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

  useEffect(() => {
    if (view !== VIEWS.LIST) setView(VIEWS.LIST);
    if (!isEmpty(params?.category) && category?.key !== params?.category) {
      selectCategory(params?.category);
    }
  }, [params, category, view]);

  useEffect(() => {
    if (!isEmpty(category?.id)) {
      loadAssets(category.id);
    }
  }, [category]);

  useEffect(() => {
    // if (!isEmpty(assets)) {
    loadAssetsData();
    // }
  }, [assets, page, size]);

  useEffect(() => {
    const assetId = query.get('open');
    if (isEmpty(assetId)) {
      setAsset(null);
    } else if (asset?.id !== assetId) {
      loadAsset(assetId);
    }
  }, [query, asset]);

  // ·········································································
  // HANDLERS

  const handleOnBack = () => {
    history.goBack();
  };

  const handleOnCardClick = (item) => {
    console.log(item);
    history.push(`${location.pathname}?open=${item.id}`);
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

  // ·········································································
  // RENDER

  return (
    <Stack direction="column" fullHeight>
      <Paper shadow="none" skipFlex>
        <SearchInput variant="filled" />
      </Paper>
      <Stack>
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
            <PaginatedList
              {...serverData}
              breakAt={{
                1400: 3,
                1200: 2,
                900: 1,
              }}
              margin={16}
              paperProps={{ shadow: 'none', padding: 0 }}
              itemRender={(p) => (
                <CardWrapper
                  {...p}
                  variant={cardVariant}
                  onClick={handleOnCardClick}
                  onDelete={handleOnCardDelete}
                />
              )}
              columns={columns}
              loading={loading}
              layout={'grid'}
              onPageChange={setPage}
              onSizeChange={setSize}
            />
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
        {!loading && !isEmpty(asset) && (
          <Box style={{ width: 360 }}>
            <LibraryDetail asset={asset} />
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

export { ListAssetPage };
export default ListAssetPage;
