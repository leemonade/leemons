import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, SearchInput, Select, createStyles } from '@bubbles-ui/components';
import { usePickerCategories } from '@leebrary/components/AssetPickerDrawer/hooks/usePickerCategories';
import { isArray, keyBy, map, pick, sortBy } from 'lodash';

export const useHeaderStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      position: 'sticky',
      top: globalTheme.spacing.padding.lg,
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.padding.lg,
      '& *': {
        flexGrow: 1,
      },

      // TODO: Set color token
      background: '#F8F9FC',
      marginTop: globalTheme.spacing.padding.md,
      margiBottom: globalTheme.spacing.padding.md,
      padding: globalTheme.spacing.padding.md,
      paddingBottom: globalTheme.spacing.padding.lg,
      zIndex: 1,
    },
    whiteCover: {
      // This is needed to avoid content be shown above header :(
      top: 0,
      transform: `translateY(${-24}px)`,
      left: 0,
      position: 'absolute',
      width: '100%',
      height: globalTheme.spacing.padding.lg,
      background: theme.white,
    },
  };
});

export function Header({ localizations, categories: categoriesToUse, onChange }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);

  const categories = usePickerCategories();

  const categoriesByKey = useMemo(() => keyBy(categories, 'key'), [categories]);
  const filteredCategories = useMemo(
    () =>
      isArray(categoriesToUse) && categoriesToUse?.length
        ? Object.values(pick(categoriesByKey, categoriesToUse))
        : categories,
    [categories, categoriesToUse]
  );
  const resourcesData = useMemo(
    () =>
      sortBy(
        filteredCategories.map((filteredCategory) => ({
          label: filteredCategory.menuItem.label,
          value: filteredCategory.id,
          order: filteredCategory.order,
          icon: filteredCategory.menuItem.iconSvg.startsWith('/api')
            ? `${leemons.apiUrl}${filteredCategory.menuItem.iconSvg}`
            : filteredCategory.menuItem.iconSvg,
        })),
        'order'
      ),
    [filteredCategories]
  );

  useEffect(() => {
    if (!map(resourcesData, 'value').includes(category) && resourcesData?.length) {
      setCategory(resourcesData[0].value);
    }
  }, [resourcesData]);

  useEffect(() => onChange?.({ category, search }), [category, search]);

  const { classes } = useHeaderStyles();

  return (
    <Box className={classes.root}>
      <Box className={classes.whiteCover}></Box>
      <SearchInput
        placeholder={localizations?.search?.placeholder}
        label={localizations?.search?.label}
        value={search}
        onChange={(newSearch) => setSearch(newSearch)}
      />
      {resourcesData?.length > 1 && (
        <Select
          key="select"
          placeholder={localizations?.resources?.placeholder}
          label={localizations?.resources?.label}
          data={resourcesData}
          value={category}
          onChange={setCategory}
        />
      )}
    </Box>
  );
}

Header.propTypes = {
  localizations: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
};
