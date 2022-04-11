import React from 'react';
import { isFunction, map } from 'lodash';
import loadable from '@loadable/component';
import { Box } from '@bubbles-ui/components';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { getZoneRequest } from './getZone';

function dynamicImport(pluginName, component) {
  return loadable(() => import(`@leemons/plugins/${pluginName}/src/widgets/${component}.js`));
}

function ZoneWidgets({ zone, container = <Box />, onGetZone = () => {}, children }) {
  const [store, render] = useStore();

  async function load() {
    const data = await getZoneRequest(zone);
    store.zone = data.zone;
    onGetZone(store.zone);
    render();
  }

  React.useEffect(() => {
    if (zone) load();
  }, [zone]);

  return React.cloneElement(container, {
    children:
      store.zone && store.zone.widgetItems.length
        ? map(store.zone.widgetItems, (item) => {
            if (isFunction(children)) {
              return children({
                key: item.id,
                item,
                Component: dynamicImport(item.pluginName, item.url),
                properties: item.properties,
              });
            }
            React.cloneElement(children, {
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
