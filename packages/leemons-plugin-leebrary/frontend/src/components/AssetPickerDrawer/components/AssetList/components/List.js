import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import { getAssetsRequest } from '@leebrary/request';
import useAssets from '@leebrary/request/hooks/queries/useAssets';
import { map } from 'lodash';
import { Box, Loader, Pager, createStyles } from '@bubbles-ui/components';
import SearchEmpty from '@leebrary/components/SearchEmpty';
import prefixPN from '@leebrary/helpers/prefixPN';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import { Item } from './Item';

export const useListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: globalTheme.spacing.padding.xlg,
      gap: globalTheme.spacing.padding.lg,
    },
    list: {
      display: 'flex',
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.md,
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
  const { data: assets, isLoading } = useQuery({
    // TODO: Add a good queryKey
    queryKey: ['assetPickerDrawer.assets', query],
    queryFn: () =>
      getAssetsRequest({
        ...options,
        category: query.category,
        criteria: query.search || '',
        showPublic: true,
        published: true,
      }),
    select: (data) => data.assets,
  });

  return { assets, isLoading };
}

export function List({ query, filters, onSelect }) {
  const { assets, isLoading: isLoadingList } = useAssetList(query, filters);

  if (assets?.length > 25) {
    assets.length = 25;
  }

  const { data: assetsData, isLoading: isLoadingData } = useAssets({
    ids: map(assets, 'asset'),
    enabled: !!assets?.length,
  });

  const isLoading = isLoadingList || isLoadingData;

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const totalCount = assetsData?.length;
  const totalPages = Math.ceil(totalCount / size);
  const items = assetsData?.slice((page - 1) * size, (page - 1) * size + size) || [];

  const [t] = useTranslateLoader(prefixPN('list'));
  const { classes } = useListStyles();

  if (isLoading) {
    return (
      <Box className={classes.root}>
        <Loader />
      </Box>
    );
  }
  if (!assetsData?.length) {
    return (
      <Box className={classes.root}>
        <SearchEmpty t={t} />
      </Box>
    );
  }
  return (
    <Box className={classes.root}>
      <Box className={classes.list}>
        {items.map((item) => (
          <Item key={item.id} asset={item} onSelect={onSelect} />
        ))}
      </Box>
      <Box className={classes.pager}>
        <Pager
          withSize
          withControls
          page={page}
          totalPages={totalPages}
          size={size}
          onSizeChange={setSize}
          onChange={setPage}
        />
      </Box>
    </Box>
  );
}

List.propTypes = {
  query: PropTypes.object,
  filters: PropTypes.object,
  onSelect: PropTypes.func,
};
