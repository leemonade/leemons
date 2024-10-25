import { useMouse } from '@mantine/hooks';

export default function useIsOverHeader() {
  const { y, x } = useMouse();
  return y < 80 && x > 0 && y > 0;
}
