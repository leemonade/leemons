import { useMemo } from 'react';

import useZone from '@widgets/requests/hooks/queries/useZone';

import AlwaysAvailable from '../../../components/widgets/AlwaysAvailable';
import Fixed from '../../../components/widgets/Fixed';
import dynamicImport from '../helpers/dynamicImport';

export const WIDGET_ZONE_ID = 'assignables.assignmentForm.datePicker';

export const defaultWidgets = [
  {
    id: 'alwaysAvailable',
    labelKey: 'assignables.assignmentForm.dates.optionsInput.options.alwaysAvailable',
    component: AlwaysAvailable,
  },
  {
    id: 'fixed',
    labelKey: 'assignables.assignmentForm.dates.optionsInput.options.fixed',
    component: Fixed,
  },
];

export default function useWidgets() {
  const { data: zones, isLoading } = useZone({
    id: WIDGET_ZONE_ID,
  });

  const widgets = useMemo(
    () =>
      zones?.widgetItems?.map((item) => ({
        id: item.key,
        labelKey: item.properties?.label,
        component: dynamicImport({ pluginName: item.pluginName, path: item.url, preload: true }),
      })),
    [zones?.widgetItems]
  );

  const data = defaultWidgets.concat(widgets ?? []);

  return { data, isLoading };
}
