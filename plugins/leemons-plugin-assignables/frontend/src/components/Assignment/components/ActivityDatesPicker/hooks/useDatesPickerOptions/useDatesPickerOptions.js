import { useMemo } from 'react';

import { get } from 'lodash';

import useWidgetLocalizations from './hooks/useWidgetLocalizations';
import useWidgets from './hooks/useWidgets';

export default function useDatesPickerOptions() {
  const { data: widgets, isLoading: isLoadingWidgets } = useWidgets();
  const { data: localizations, isLoading: isLoadingLocalizations } = useWidgetLocalizations({
    widgets,
  });

  const options = useMemo(
    () =>
      widgets.map((widget) => ({
        value: widget.id,
        label: get(localizations?.items, widget?.labelKey),
      })),
    [widgets, localizations?.items]
  );

  const components = useMemo(
    () =>
      widgets.reduce((acc, widget) => {
        acc[widget.id] = widget.component;
        return acc;
      }, {}),
    [widgets]
  );

  return { options, components, isLoading: isLoadingWidgets || isLoadingLocalizations };
}
