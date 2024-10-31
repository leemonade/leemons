import { useState } from 'react';

import { Box, Stack, Loader, Pager, createStyles } from '@bubbles-ui/components';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { useQuery } from '@tanstack/react-query';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import CardList from './CardList/List';
import { RowList } from './RowList/List';
import ThumbnailList from './ThumnailList/List';

import SearchEmpty from '@leebrary/components/SearchEmpty';
import prefixPN from '@leebrary/helpers/prefixPN';
import { getAssetsRequest } from '@leebrary/request';
import useAssets from '@leebrary/request/hooks/queries/useAssets';

export const useListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flex: 1,
      width: '100%',
      flexDirection: 'column',
      paddingBottom: globalTheme.spacing.padding.xlg,
      gap: globalTheme.spacing.padding.lg,
    },
    pager: {
      width: '100%',
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
    },
  };
});

export function useAssetList(query, options) {
  const verifiedQuery = {
    category: query.category,
    criteria: query.search || '',
    showPublic: true,
    published: true,
  };
  if (query.type && query.type !== 'all') verifiedQuery.type = query.type;

  const { data: assets, isLoading } = useQuery({
    // TODO: Add a good queryKey
    queryKey: ['assetPickerDrawer.assets', query, options],
    queryFn: () =>
      getAssetsRequest({
        ...options,
        ...verifiedQuery,
        preferCurrent: true,
      }),
    select: (data) => data.assets,
  });

  return { assets, isLoading };
}

export function List({ variant, query, filters, onSelect }) {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);

  const { assets, isLoading: isLoadingList } = useAssetList(query, filters);

  const totalCount = assets?.length ?? 0;
  const totalPages = Math.ceil(totalCount / size);
  const assetsToLoad = assets?.slice((page - 1) * size, page * size) ?? [];

  const { data: assetsData, isLoading: isLoadingData } = useAssets({
    ids: map(assetsToLoad, 'asset'),
    enabled: totalCount > 0,
  });

  const isLoading = isLoadingList || (!!assets?.length && isLoadingData);

  const [t] = useTranslateLoader(prefixPN('list'));
  const { classes } = useListStyles({}, { name: 'AssetListList' });

  global.isLoadingList = isLoadingList;
  global.enabled = !!assets?.length;
  global.isLoadingData = isLoadingData;
  if (isLoading) {
    return (
      <Box className={classes.root}>
        <Loader />
      </Box>
    );
  }
  if (!assets?.length || !assetsData?.length) {
    return (
      <Stack fullWidth justifyContent="center" alignItems="center">
        <Box style={{ marginBottom: 100 }}>
          <SearchEmpty t={t} />
        </Box>
      </Stack>
    );
  }

  return (
    <Box className={classes.root}>
      {variant === 'rows' && <RowList items={assetsData} onSelect={onSelect} />}
      {variant === 'thumbnails' && <ThumbnailList items={assetsData} onSelect={onSelect} />}
      {variant === 'cards' && <CardList items={assetsData} onSelect={onSelect} />}
      {totalPages > 1 && (
        <Box className={classes.pager}>
          <Pager
            withSize={false}
            withControls
            page={page}
            sizes={[30, 60, 90]}
            totalPages={totalPages}
            size={size}
            onSizeChange={setSize}
            onChange={setPage}
          />
        </Box>
      )}
    </Box>
  );
}

List.propTypes = {
  variant: PropTypes.oneOf(['rows', 'thumbnails', 'cards']),
  query: PropTypes.object,
  filters: PropTypes.object,
  onSelect: PropTypes.func,
};
