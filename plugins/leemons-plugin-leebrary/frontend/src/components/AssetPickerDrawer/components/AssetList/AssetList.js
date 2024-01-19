import { Box, createStyles } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Header } from './components/Header';
import { List } from './components/List';

export const useAssetListStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      // gap: globalTheme.spacing.gap.xlg,
      height: '100%',
      width: '100%',
      zIndex: 0,
    },
    list: {
      zIndex: 0,
      display: 'flex',
      flex: 1,
      height: '100%',
      width: '100%',
    },
  };
});

export function AssetList({ variant, localizations, categories, filters, onSelect }) {
  const { classes } = useAssetListStyles({}, { name: 'AssetList' });
  const [query, setQuery] = useState({});

  return (
    <Box className={classes.root}>
      <Header localizations={localizations?.filters} categories={categories} onChange={setQuery} />
      <Box className={classes.list}>
        <List variant={variant} query={query} filters={filters} onSelect={onSelect} />
      </Box>
    </Box>
  );
}

AssetList.propTypes = {
  variant: PropTypes.oneOf(['rows', 'thumbnails', 'cards']),
  localizations: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.string),
  filters: PropTypes.object,
  onSelect: PropTypes.func,
};
