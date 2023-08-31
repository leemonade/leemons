import { useQuery } from '@tanstack/react-query';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { Box, Loader, Pager, createStyles } from '@bubbles-ui/components';

import SearchEmpty from '@leebrary/components/SearchEmpty';
import prefixPN from '@leebrary/helpers/prefixPN';
import { getAssetsRequest } from '@leebrary/request';
import useAssets from '@leebrary/request/hooks/queries/useAssets';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import CardList from './CardList/List';
import { RowList } from './RowList/List';
import ThumbnailList from './ThumnailList/List';

export const useListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
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
  const { data: assets, isLoading } = useQuery({
    // TODO: Add a good queryKey
    queryKey: ['assetPickerDrawer.assets', query, options],
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

export function List({ variant, query, filters, onSelect }) {
  const { assets, isLoading: isLoadingList } = useAssetList(query, filters);

  const { data: assetsData, isLoading: isLoadingData } = useAssets({
    ids: map(assets, 'asset'),
    enabled: !!assets?.length,
  });

  const isLoading = isLoadingList || (!!assets?.length && isLoadingData);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(30);
  const totalCount = assetsData?.length;
  const totalPages = Math.ceil(totalCount / size);
  const items = assetsData?.slice((page - 1) * size, page * size) || [];

  const [t] = useTranslateLoader(prefixPN('list'));
  const { classes } = useListStyles();

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
      <Box className={classes.root}>
        <SearchEmpty t={t} />
      </Box>
    );
  }
  return (
    <Box className={classes.root}>
      {variant === 'rows' && <RowList items={items} onSelect={onSelect} />}
      {variant === 'thumbnails' && <ThumbnailList items={items} onSelect={onSelect} />}
      {variant === 'cards' && <CardList items={items} onSelect={onSelect} />}
      <Box className={classes.pager}>
        <Pager
          withSize
          withControls
          page={page}
          sizes={[30, 60, 90]}
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
  variant: PropTypes.oneOf(['rows', 'thumbnails', 'cards']),
  query: PropTypes.object,
  filters: PropTypes.object,
  onSelect: PropTypes.func,
};
