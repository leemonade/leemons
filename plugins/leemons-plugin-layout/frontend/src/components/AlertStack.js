import { useEffect } from 'react';
import hooks from 'leemons-hooks';
import { useNotifications } from '@bubbles-ui/notifications';

export default function AlertStack() {
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
  };

  useEffect(() => {
    hooks.addAction('layout:add:alert', addAlert);
    return () => {
      hooks.removeAction('layout:add:alert', addAlert);
    };
  });
  return null;
}
