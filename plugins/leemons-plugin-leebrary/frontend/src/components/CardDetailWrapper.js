import React from 'react';

import { getShare, useBeforeUnload, useStore } from '@common';
import loadable from '@loadable/component';
import { getSessionConfig } from '@users/session';
import { isNil } from 'lodash';
import PropTypes from 'prop-types';

import { LibraryDetail } from '@leebrary/components/LibraryDetail';

function dynamicImport(pluginName, component) {
  return loadable(async () => {
    try {
      return await import(`@app/plugins/${pluginName}/src/widgets/leebrary/${component}.js`);
    } catch (error) {
      return await import(`@app/plugins/${pluginName}/src/widgets/leebrary/${component}.tsx`);
    }
  });
}

const CardDetailWrapper = ({ category, ...props }) => {
  const [store] = useStore();
  let Component = LibraryDetail;
  const componentOwner = category?.componentOwner || category?.pluginOwner;

  if (category?.detailComponent && componentOwner) {
    try {
      Component = dynamicImport(componentOwner, category?.detailComponent);
    } catch (e) {
      //
    }
  }

  function stopXApi() {
    if (store.category && store.asset) {
      const { program } = getSessionConfig();
      const addLogStatement = getShare('xapi', 'addLogStatement');
      const verbs = getShare('xapi', 'verbs');
      if (addLogStatement) {
        addLogStatement({
          verb: verbs.TERMINATED,
          object: {
            objectType: 'Activity',
            id: `{hostname}/api/view/leebrary/${store.category.key}`,
            definition: {
              extensions: {
                id: store.asset.id,
                name: store.asset.name,
                program,
                type: store.asset.original.file?.type || store.asset.original.cover?.type || null,
              },
              description: {
                'en-US': 'End to view leebrary asset',
              },
            },
          },
        });
      }
    }
  }

  React.useEffect(() => {
    store.category = category;
    store.asset = props.asset;
    if (category && props.asset) {
      const { program } = getSessionConfig();
      const addLogStatement = getShare('xapi', 'addLogStatement');
      const verbs = getShare('xapi', 'verbs');
      if (addLogStatement) {
        addLogStatement({
          verb: verbs.INITIALIZED,
          object: {
            objectType: 'Activity',
            id: `{hostname}/api/view/leebrary/${category.key}`,
            definition: {
              extensions: {
                id: props.asset.id,
                name: props.asset.name,
                program,
                type: props.asset.original.file?.type || props.asset.original.cover?.type || null,
              },
              description: {
                'en-US': 'Start to view leebrary asset',
              },
            },
          },
        });
      }
    }
    return () => {
      stopXApi();
    };
  }, [category?.id, props?.asset?.id]);

  useBeforeUnload(() => {
    stopXApi();
  });

  return !isNil(category) ? <Component {...props} /> : null;
};

CardDetailWrapper.propTypes = {
  category: PropTypes.any,
};

export { CardDetailWrapper };
export default CardDetailWrapper;
