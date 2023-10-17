import { useEffect } from 'react';
// import { Alert, Box } from '@bubbles-ui/components';
// import { findIndex } from 'lodash';
import hooks from 'leemons-hooks';
import { useNotifications } from '@bubbles-ui/notifications';

export default function AlertStack() {
  /*
  const alertRef = useRef([]);
  const [alerts, setAlerts] = useState([]);

  const removeAlert = (id) => {
    const index = findIndex(alertRef.current, { id });
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

  useEffect(() => {
    alertRef.current = alerts;
  }, [alerts]);
  */

  const notifications = useNotifications();

  const addAlert = ({ args }) => {
    const { type, title, message, options } = args[0];
    const id = new Date().getTime();
    notifications.showNotification({
      id,
      title,
      message,
      severity: type,
      autoClose: options?.closeDelay || 5000,
    });
    // setAlerts([...alerts, { id, type, title, message, options }]);
    // waitAndCloseAlert(id, options?.closeDelay);
  };

  useEffect(() => {
    hooks.addAction('layout:add:alert', addAlert);
    return () => {
      hooks.removeAction('layout:add:alert', addAlert);
    };
  });
  return null;
  /*
  return (
    <Box>
      {alerts.map((alert) => (
        <Box key={alert.id} mb={2}>
          <Alert severity={alert.type} title={alert.title} onClose={() => removeAlert(alert.id)}>
            {alert.message}
          </Alert>
        </Box>
      ))}
    </Box>
  );
  */
}
