import { useEffect } from 'react';
import { ExclamationCircleIcon, BanIcon } from '@heroicons/react/solid';
import { useAlerts, Alerts } from '@classroom/components/alerts';
import { Button } from 'leemons-ui';

function test() {
  const { addAlert, ...alerts } = useAlerts({ timeout: 0 });
  const errors = [
    { icon: ExclamationCircleIcon, label: 'Ha ocurrido un error D:', level: 'error' },
    {
      icon: BanIcon,
      label: 'Oye tío, lo has hecho de puta madre :D',
      level: 'success',
      timeout: 0,
    },
  ];

  useEffect(() => {
    addAlert(errors);
  }, []);

  return (
    <div>
      <Button onClick={() => addAlert(errors)}>ADD Alerts</Button>
      <Alerts {...alerts} />
      <p>Aquí no ha pasado nada :D</p>
    </div>
  );
}

export default test;
