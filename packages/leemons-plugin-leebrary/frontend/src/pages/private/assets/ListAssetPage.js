/* eslint-disable no-unreachable */
import React, { useEffect, useMemo, useState, useContext } from 'react';
import { isEmpty, isArray } from 'lodash';
import { useHistory, useParams } from 'react-router-dom';
import { Box, Stack, Paper, SearchInput, PaginatedList } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useRequestErrorMessage } from '@common';
import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import prefixPN from '../../../helpers/prefixPN';
import { getAssetsRequest, getAssetsByIdsRequest } from '../../../request';
import LibraryContext from '../../../context/LibraryContext';
import { VIEWS } from '../library/Library.constants';
import { getPageItems } from '../../../helpers/getPageItems';
import { CardWrapper } from '../../../components/CardWrapper';

const ListAssetPage = () => {
  const { file, setView, category, selectCategory, setAsset, asset } = useContext(LibraryContext);
  const [t] = useTranslateLoader(prefixPN('list'));
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [assets, setAssets] = useState([]);
  const [serverData, setServerData] = useState({});
  const [, , , getErrorMessage] = useRequestErrorMessage();
  const history = useHistory();
  const params = useParams();

  // ·········································································
  // DATA PROCESSING

  const loadAssets = async (categoryId) => {
    try {
      setLoading(true);
      const response = await getAssetsRequest({ category: categoryId });
      if (response.assets) {
        setAssets(response.assets);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  const loadAssetsData = async () => {
    try {
      setLoading(true);
      const paginated = getPageItems({ data: assets, page, size });
      const assetIds = paginated.items.map((item) => item.asset);
      const response = await getAssetsByIdsRequest(assetIds);
      console.log('loadAssetsData:', response);
      paginated.items = response.assets || [];
      setServerData(paginated);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      addErrorAlert(getErrorMessage(err));
    }
  };

  // ·········································································
  // EFFECTS

  useEffect(() => {
    setView(VIEWS.LIST);
    selectCategory(params?.category);
  }, [params]);

  useEffect(() => {
    if (!isEmpty(category?.id)) {
      loadAssets(category.id);
    }
  }, [category]);

  useEffect(() => {
    if (!isEmpty(assets)) {
      loadAssetsData();
    }
  }, [assets, page, size]);

  // ·········································································
  // HANDLERS

  const handleOnBack = () => {
    history.goBack();
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

  // ·········································································
  // RENDER

  return (
    <Stack direction="column" fullHeight>
      <Paper shadow="none" skipFlex>
        <SearchInput variant="filled" />
      </Paper>
      <Box sx={(theme) => ({ paddingRight: theme.spacing[5], paddingLeft: theme.spacing[5] })}>
        {!isEmpty(serverData?.items) && (
          <PaginatedList
            {...serverData}
            breakAt={{
              1400: 3,
              1200: 2,
              900: 1,
            }}
            margin={16}
            paperProps={{ shadow: 'none', padding: 0 }}
            itemRender={CardWrapper}
            columns={columns}
            loading={loading}
            layout={'grid'}
            onPageChange={setPage}
            onSizeChange={setSize}
          />
        )}
      </Box>
    </Stack>
  );
};

export { ListAssetPage };
export default ListAssetPage;
