import { Box } from '@bubbles-ui/components';
import { useStore } from '@common';
import loadable from '@loadable/component';
import { isFunction, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { getZoneRequest } from './getZone';

function dynamicImport(pluginName, component) {
  return loadable(() => import(`@leemons/plugins/${pluginName}/src/widgets/${component}.js`));
}

function ZoneWidgets({ zone, container = <Box />, onGetZone = () => {}, children }) {
  const [store, render] = useStore({
    cache: {},
    c: null,
  });

  async function load() {
    store.zoneLoaded = zone;
    const data = await getZoneRequest(zone);
    // console.log('data:', data);
    store.zone = data.zone;
    onGetZone(store.zone);
    render();
  }

  React.useEffect(() => {
    if (zone && (!store.zoneLoaded || store.zoneLoaded !== zone)) load();
  }, [zone]);

  return React.cloneElement(container, {
    children:
      store.zone && store.zone.widgetItems.length
        ? map(store.zone.widgetItems, (item) => {
            if (isFunction(children)) {
              if (
                !store.cache[item.id] ||
                (store.cache[item.id] && store.cache[item.id].func !== children)
              ) {
                store.cache[item.id] = {
                  func: children,
                  result: children({
                    key: item.id,
                    item,
                    Component: dynamicImport(item.pluginName, item.url),
                    properties: item.properties,
                  }),
                };
              }
              return store.cache[item.id].result;
            }
            return React.cloneElement(children, {
              key: item.id,
              item,
              Component: dynamicImport(item.pluginName, item.url),
              properties: item.properties,
            });
          })
        : null,
  });
}

ZoneWidgets.propTypes = {
  zone: PropTypes.string.isRequired,
  container: PropTypes.any,
  children: PropTypes.any,
  onGetZone: PropTypes.func,
};

// eslint-disable-next-line import/prefer-default-export
export { ZoneWidgets };
