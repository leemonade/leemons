import { Box } from '@bubbles-ui/components';
import loadable from '@loadable/component';
import { isFunction, noop } from 'lodash';
import PropTypes from 'prop-types';
import React, { cloneElement, useEffect, useMemo } from 'react';
import ZoneWidgetsBoundary from './ZoneWidgetsBoundary';
import useZone from './requests/hooks/queries/useZone';

function dynamicImport(pluginName, component, path = 'src/widgets') {
  return loadable(() => import(`@leemons/plugins/${pluginName}/${path}/${component}.js`));
}

export function useWidgetItemsRenderer({ renderer, widgetItems = [], ErrorBoundary }) {
  const importedWidgets = useMemo(
    () =>
      new Map(
        widgetItems.map((item) => {
          const Component = dynamicImport(item.pluginName, item.url, item.path);
          return [item.id, Component];
        })
      ),
    [widgetItems]
  );

  return useMemo(
    () =>
      widgetItems
        .map((item) => {
          const props = {
            key: item.id,
            item,
            Component: importedWidgets.get(item.id),
            properties: item.properties,
          };

          const widget = isFunction(renderer) ? renderer(props) : cloneElement(renderer, props);

          if (widget) {
            return cloneElement(ErrorBoundary, {
              key: item.id,
              ...props,
              children: widget,
            });
          }

          return null;
        })
        .filter(Boolean),
    [renderer, widgetItems, importedWidgets, ErrorBoundary]
  );
}

export function ZoneWidgets({
  zone,
  container = <Box />,
  ErrorBoundary = <ZoneWidgetsBoundary />,
  onGetZone = noop,
  children,
}) {
  const { data: zoneData } = useZone({ id: zone });

  useEffect(() => {
    if (zoneData) {
      onGetZone(zoneData);
    }
  }, [zoneData]);

  const widgets = useWidgetItemsRenderer({
    renderer: children,
    widgetItems: zoneData?.widgetItems,
    ErrorBoundary,
  });

  return useMemo(
    () =>
      cloneElement(container, {
        children: widgets,
      }),
    [container, widgets]
  );
}

ZoneWidgets.propTypes = {
  zone: PropTypes.string.isRequired,
  container: PropTypes.any,
  children: PropTypes.any,
  ErrorBoundary: PropTypes.node,
  onGetZone: PropTypes.func,
};
