import * as _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import hooks from 'leemons-hooks';
import { Alert, Box } from '@bubbles-ui/components';

const AlertStack = () => {
  const alertRef = useRef([]);
  const [alerts, setAlerts] = useState([]);

  const removeAlert = (id) => {
    const index = _.findIndex(alertRef.current, { id });
    if (index >= 0) {
      alertRef.current.splice(index, 1);
      setAlerts([...alertRef.current]);
    }
  };

  const waitAndCloseAlert = (id, delay = 60000) => {
    setTimeout(() => {
      removeAlert(id);
    }, delay);
  };

  const addAlert = ({ args }) => {
    const { type, title, message, options } = args[0];
    const id = new Date().getTime();
    setAlerts([...alerts, { id, type, title, message, options }]);
    waitAndCloseAlert(id, options?.closeDelay);
  };

  useEffect(() => {
    alertRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    hooks.addAction('layout:add:alert', addAlert);
    return () => {
      hooks.removeAction('layout:add:alert', addAlert);
    };
  });
  return (
    <Box>
      {alerts.map((alert) => (
        <Box key={alert.id} mb={2}>
          <Alert severity={alert.type} title={alert.title} onClose={() => removeAlert(alert.id)}>{alert.message}</Alert>
        </Box>
      ))}
    </Box>
  );
}

export { AlertStack };
