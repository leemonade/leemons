import dayjs from 'dayjs';

export default function getSeverity(instance) {
  if (instance?.alwaysAvailable || !instance?.dates?.deadline || !instance?.dates?.start) {
    return 'primary';
  }

  const remainingDays = dayjs(instance?.dates?.deadline).diff(
    dayjs(instance?.dates?.start),
    'd',
    true
  );

  if (remainingDays >= 6) {
    return 'primary';
  }

  if (remainingDays >= 5) {
    return 'warning';
  }

  return 'error';
}
