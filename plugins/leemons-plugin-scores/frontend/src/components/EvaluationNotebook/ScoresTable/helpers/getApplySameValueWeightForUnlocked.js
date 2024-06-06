import { filter } from 'lodash';

export default function getApplySameValueWeightForUnlocked(weights, totalTypes) {
  const { applySameValue, weights: weightValues } = weights;

  if (!applySameValue) {
    return 0;
  }

  const lockedValues = filter(weightValues, 'isLocked');
  const totalLockedWeight = lockedValues.reduce((acc, curr) => acc + curr.weight, 0);

  return (1 - totalLockedWeight) / (totalTypes - lockedValues.length);
}
