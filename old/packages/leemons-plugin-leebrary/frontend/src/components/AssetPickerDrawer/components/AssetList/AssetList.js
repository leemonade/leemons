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
      flexDirection: 'column',
      gap: globalTheme.spacing.gap.xlg,
      minHeight: '100%',
      zIndex: 0,
    },
    list: {
      zIndex: 0,
      minHeight: '100%',
    },
  };
});

export function AssetList({ variant, localizations, categories, filters, onSelect }) {
  const { classes } = useAssetListStyles();

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
