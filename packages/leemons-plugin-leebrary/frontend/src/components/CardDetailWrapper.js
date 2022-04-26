import React from 'react';
import PropTypes from 'prop-types';
import { isNil } from 'lodash';
import { LibraryDetail } from '@bubbles-ui/leemons';
import loadable from '@loadable/component';

function dynamicImport(pluginName, component) {
  return loadable(() =>
    import(`@leemons/plugins/${pluginName}/src/widgets/leebrary/${component}.js`)
  );
}

const CardDetailWrapper = ({ category, ...props }) => {
  let Component = LibraryDetail;

  if (category?.detailComponent && category?.pluginOwner) {
    try {
      Component = dynamicImport(category?.pluginOwner, category?.detailComponent);
    } catch (e) {
      //
    }
  }

  return !isNil(category) ? <Component {...props} /> : null;
};

CardDetailWrapper.propTypes = {
  category: PropTypes.any,
};

export { CardDetailWrapper };
export default CardDetailWrapper;
