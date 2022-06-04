import React from 'react';
import { useApi } from '@common';
import { listCategoriesRequest } from '@leebrary/request';
import CenterAlignedSelect from '../CenterAlignedSelect';

function useRoles() {
  const [categories] = useApi(listCategoriesRequest);

  if (!categories) {
    return [];
  }

  const categoriesFromAssignables = categories?.filter?.(
    (category) => category.pluginOwner === 'plugins.assignables'
  );

  return categoriesFromAssignables?.map?.((category) => ({
    value: category.key.replace(/^assignables\./, ''),
    label: category?.menuItem?.label,
  }));
}

export default function Type({ labels, value, onChange }) {
  const roles = useRoles();

  return (
    <CenterAlignedSelect
      orientation="horizontal"
      label={labels?.type}
      data={[
        {
          label: labels?.seeAll,
          value: 'all',
        },
        ...roles,
      ]}
      value={value}
      onChange={onChange}
    />
  );
}
