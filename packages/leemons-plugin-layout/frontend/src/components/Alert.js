import * as _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import hooks from 'leemons-hooks';
import { Alert as AlertUI, Button, ImageLoader } from 'leemons-ui';

function Alert() {
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
    <div>
      {alerts.map((alert) => (
        <div key={alert.id} className="m-2">
          <AlertUI color={alert.type}>
            <div className="flex-1">
              <label>
                {alert.title ? <h4>{alert.title}</h4> : null}
                {alert.message ? <p className="text-sm text-opacity-60">{alert.message}</p> : null}
              </label>
            </div>
            <div className="flex-none">
              <Button
                color="ghost"
                circle
                className={`text-${alert.type} hover:bg-${alert.type} hover:bg-opacity-20 btn-sm`}
              >
                <div
                  style={{ width: '18px', height: '18px' }}
                  className="relative cursor-pointer"
                  onClick={() => removeAlert(alert.id)}
                >
                  <ImageLoader src="/assets/svgs/close.svg" className="stroke-current" />
                </div>
              </Button>
            </div>
          </AlertUI>
        </div>
      ))}
    </div>
  );
}

export default Alert;
