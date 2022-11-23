import React from 'react';
import PropTypes from 'prop-types';
import { useIdle } from '@bubbles-ui/components';
import { useStore } from '@common';
import { getSessionConfig } from '@users/session';
import { XAPI } from '@xapi';

export function Provider({ children }) {
  const [store] = useStore();
  const idle = useIdle(2000);

  function onInterval() {
    const { program } = getSessionConfig();
    if (store.program !== program) {
      XAPI.addLogStatement({
        verb: XAPI.VERBS.INITIALIZED,
        object: {
          objectType: 'Activity',
          id: '{hostname}/api/view/program',
          definition: {
            extensions: {
              id: program,
            },
            description: {
              'en-US': 'Start to view Program',
            },
          },
        },
      });
    }
    store.program = program;
  }

  React.useEffect(() => {
    const interval = setInterval(() => {
      onInterval();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}

Provider.propTypes = {
  children: PropTypes.node,
};
