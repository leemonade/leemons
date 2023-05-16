import React from 'react';
import PropTypes from 'prop-types';
import { share, useBeforeUnload, useIdle, useStore } from '@common';
import { getSessionConfig } from '@users/session';
import { XAPI } from '@xapi';

export function Provider({ children }) {
  const [store] = useStore();
  const idle = useIdle(1000 * 60 * 15); // ES: 15 Minutos

  function startProgram(program) {
    XAPI.addLogStatement({
      verb: XAPI.VERBS.INITIALIZED,
      object: {
        objectType: 'Activity',
        id: '{hostname}/api/view/program',
        definition: {
          extensions: {
            id: program,
            ip: '{ip}',
          },
          description: {
            'en-US': 'Start to view Program',
          },
        },
      },
    });
  }

  function stopProgram(program) {
    XAPI.addLogStatement({
      verb: XAPI.VERBS.TERMINATED,
      object: {
        objectType: 'Activity',
        id: '{hostname}/api/view/program',
        definition: {
          extensions: {
            id: program,
            ip: '{ip}',
          },
          description: {
            'en-US': 'End to view Program',
          },
        },
      },
    });
  }

  function onInterval() {
    const { program } = getSessionConfig();
    if (program) {
      if (store.program !== program) {
        // ES: Si los programas son distintos hay que marcar como que se dejo de ver uno y se empezo a ver el otro
        if (store.program) {
          stopProgram(store.program);
        }
        if (program) startProgram(program);
      } else {
        // ES: Si el usuario lleva parado el tiempo especificado registramos que ya no esta viendo ese programa
        if (idle && store.idle !== idle) {
          stopProgram(program);
        }
        // ES: Si el usuario estaba parado y vuelve a estar en la web registramos que de nuevo esta viendo el programa
        if (!idle && store.idle !== idle) {
          startProgram(program);
        }
      }
    }
    store.idle = idle;
    store.program = program;
  }

  useBeforeUnload(() => {
    const { program } = getSessionConfig();
    if (program && !store.idle) stopProgram(program);
  });

  store.onInterval = onInterval;

  React.useEffect(() => {
    const interval = setInterval(() => {
      store.onInterval();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
