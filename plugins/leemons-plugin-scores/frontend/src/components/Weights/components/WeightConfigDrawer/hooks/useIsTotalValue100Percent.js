import { useWatch } from 'react-hook-form';

export default function useIsTotalValue100Percent({ control }) {
  const type = useWatch({ control, name: 'type' });
  const weights = useWatch({ control, name: 'weights' });

  if (type === 'averages') {
    return true;
  }

  if (!weights) {
    return false;
  }

  const totalValue = weights.weight?.reduce((acc, weight) => acc + (weight.weight ?? 0), 0);

  return (
    totalValue === 0.9999 ||
    totalValue === 1 ||
    (!!weights.applySameValue && !weights.weight?.length)
  );
}
