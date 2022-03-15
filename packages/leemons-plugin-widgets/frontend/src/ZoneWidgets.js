import React from 'react';
import { isFunction, map } from 'lodash';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import { useStore } from '@common';
import { getZoneRequest } from './getZone';

function dynamicImport(pluginName, component) {
  return loadable(() => import(`@leemons/plugins/${pluginName}/src/widgets/${component}.js`));
}

function ZoneWidgets({ zone, children }) {
  const [store, render] = useStore();

  async function load() {
    const data = await getZoneRequest(zone);
    store.zone = data.zone;
    render();
  }

  React.useEffect(() => {
    if (zone) load();
  }, [zone]);

  return store.zone && store.zone.widgetItems.length
    ? map(store.zone.widgetItems, (item) => {
        if (isFunction(children)) {
          return children({
            key: item.id,
            Component: dynamicImport(item.pluginName, item.url),
          });
        }
        React.cloneElement(children, {
          key: item.id,
          Component: dynamicImport(item.pluginName, item.url),
        });
      })
    : null;
}

ZoneWidgets.propTypes = {
  zone: PropTypes.string.isRequired,
  children: PropTypes.any,
};

// eslint-disable-next-line import/prefer-default-export
export { ZoneWidgets };
