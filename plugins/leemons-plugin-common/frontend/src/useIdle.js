import { useIdle as _useIdle } from '@bubbles-ui/components';

export function useIdle(time, config) {
  const idle = _useIdle(time, config);
  // TODO: Comprobar si se esta viendo un video o un audio y si lo esta devolver false
  return idle;
}
