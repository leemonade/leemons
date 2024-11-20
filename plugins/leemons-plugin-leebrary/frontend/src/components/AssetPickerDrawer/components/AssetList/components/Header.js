import { useEffect, useMemo, useState } from 'react';

import { Box, SearchInput, Select, createStyles } from '@bubbles-ui/components';
import { isArray, keyBy, map, pick, sortBy } from 'lodash';
import PropTypes from 'prop-types';

import { usePickerCategories } from '@leebrary/components/AssetPickerDrawer/hooks/usePickerCategories';
import loadMediaTypes from '@leebrary/helpers/loadMediaTypes';

export const useHeaderStyles = createStyles((theme) => {
  const globalTheme = theme.other.global;

  return {
    root: {
      position: 'sticky',
      top: 0,
      display: 'flex',
      flexDirection: 'row',
      gap: globalTheme.spacing.padding.md,
      paddingTop: globalTheme.spacing.padding.lg,
      paddingBottom: globalTheme.spacing.padding.md,
      zIndex: 1,
    },
  };
});

export function Header({
  localizations,
  categories: categoriesToUse,
  onChange,
  onlyImages,
  hideMediaFilter,
  hideAddonsFilter,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(null);
  const [mediaTypes, setMediaTypes] = useState([]);
  const [mediaTypeFilter, setMediaTypeFilter] = useState('all');

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
          type: filteredCategory.type,
          icon: filteredCategory.menuItem.iconSvg.startsWith('/api')
            ? `${leemons.apiUrl}${filteredCategory.menuItem.iconSvg}`
            : filteredCategory.menuItem.iconSvg,
        })),
        ['type', 'order']
      ),
    [filteredCategories]
  );

  useEffect(() => {
    if (!map(resourcesData, 'value').includes(category) && resourcesData?.length) {
      setCategory(resourcesData[0].value);
    }
  }, [resourcesData]);

  useEffect(
    () => onChange?.({ category, search, type: mediaTypeFilter }),
    [category, search, mediaTypeFilter]
  );

  const { classes } = useHeaderStyles({}, { name: 'AssetList-Header' });

  // ----------------------------------------------------------------------------------
  // MEDIA TYPES FILTER

  useEffect(() => {
    const categoryIsMediaFiles = categoriesByKey?.['media-files']?.id === category;

    if (categoryIsMediaFiles && !hideMediaFilter && !onlyImages) {
      loadMediaTypes(categoriesByKey?.['media-files']?.id).then((types) => {
        setMediaTypes([...types]);
      });
    } else {
      setMediaTypes([]);
    }
  }, [category]);

  const mediaTypeSelectData = useMemo(() => {
    if (!mediaTypes?.length) return null;
    return [{ label: localizations?.mediaType?.allTypes, value: 'all' }, ...mediaTypes];
  }, [mediaTypes, localizations]);

  return (
    <Box className={classes.root}>
      {resourcesData?.length > 1 && (
        <Select
          key="select-category"
          placeholder={localizations?.resources?.placeholder}
          label={localizations?.resources?.label}
          data={resourcesData}
          value={category}
          onChange={setCategory}
        />
      )}

      {mediaTypes?.length > 1 && (
        <Select
          key="select-media-type"
          placeholder={localizations?.mediaType?.placeholder}
          label={localizations?.mediaType?.label}
          data={mediaTypeSelectData}
          value={mediaTypeFilter}
          onChange={setMediaTypeFilter}
        />
      )}

      <Box style={{ flexGrow: 1 }}>
        <SearchInput
          placeholder={localizations?.search?.placeholder}
          label={localizations?.search?.label}
          value={search}
          onChange={(newSearch) => setSearch(newSearch)}
        />
      </Box>
    </Box>
  );
}

Header.propTypes = {
  localizations: PropTypes.object,
  categories: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  onlyImages: PropTypes.bool,
  hideMediaFilter: PropTypes.bool,
  hideAddonsFilter: PropTypes.bool,
};
