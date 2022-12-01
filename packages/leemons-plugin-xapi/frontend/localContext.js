import React from 'react';
import PropTypes from 'prop-types';
import { useCommon } from '@common';
import { XAPI } from '@xapi';

export function Provider({ children }) {
  const { share } = useCommon();

  React.useEffect(() => {
    share('xapi', 'addLogStatement', XAPI.addLogStatement);
    share('xapi', 'addLearningStatement', XAPI.addLearningStatement);
    share('xapi', 'verbs', XAPI.VERBS);
  }, []);

  return <>{children}</>;
}

Provider.propTypes = {
  children: PropTypes.node,
};
