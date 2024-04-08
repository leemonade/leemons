import { useMemo } from 'react';
import useCategories from '@leebrary/request/hooks/queries/useCategories';

export function usePickerCategories() {
  const { data: categories } = useCategories({ placeholderData: [] });

  return useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        icon: category.menuItem.iconSvg,
        name: category.menuItem.label,
        creatable: category.creatable === true || category.creatable === 1,
      })),
    [categories]
  );
}

export default usePickerCategories;
