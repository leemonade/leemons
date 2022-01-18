import { useState } from 'react';
import { Alert } from 'leemons-ui';
import PropTypes from 'prop-types';

export function Alerts({ defaultLevel, defaultIcon, defaultLabel, alerts }) {
  if (!alerts?.length) {
    return <></>;
  }
  return (
    <>
      {alerts.map(({ level = defaultLevel, label = defaultLabel, icon: Icon = defaultIcon }, i) => (
        <Alert color={level} key={i}>
          <div className="flex-1">
            {Icon && <Icon className="w-6 h-6 mx-2 stroke-current" />}
            <label>{label}</label>
          </div>
        </Alert>
      ))}
    </>
  );
}

Alerts.propTypes = {
  defaultLevel: PropTypes.string,
  defaultIcon: PropTypes.element,
  defaultLabel: PropTypes.string,
  alerts: PropTypes.arrayOf(PropTypes.object),
};

export function useAlerts({
  level = 'error',
  icon = null,
  label = '',
  timeout = 5000,
  newOnTop,
} = {}) {
  const [alerts, setAlerts] = useState([]);
  const addAlert = (alert) => {
    let _alert = alert;
    if (!Array.isArray(alert)) {
      _alert = [alert];
    }
    _alert = _alert.map((__alert, i) => {
      const id = `${new Date().getTime()}-${i}`;
      // Remove alert after the especified timeout (0 if no timeout)
      if (__alert.timeout !== 0 && (__alert.timeout > 0 || timeout > 0)) {
        setTimeout(() => {
          setAlerts((_alerts) => {
            const mantain = _alerts.filter(({ id: _id }) => _id !== id);
            return mantain;
          });
        }, __alert.timeout || timeout);
      }
      return { ...__alert, id };
    });

    if (newOnTop) {
      setAlerts([...alerts, ..._alert]);
    } else {
      setAlerts([..._alert, ...alerts]);
    }
  };
  return {
    defaultLevel: level,
    defaultIcon: icon,
    defaultLabel: label,
    alerts,
    addAlert,
  };
}
