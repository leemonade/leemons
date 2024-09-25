import useLocalizations from '@multilanguage/requests/hooks/queries/useLocalizations';

export default function useWidgetLocalizations({ widgets }) {
  const localizationKeys = widgets.map((widget) => widget.labelKey);

  return useLocalizations({
    keys: localizationKeys,
  });
}
