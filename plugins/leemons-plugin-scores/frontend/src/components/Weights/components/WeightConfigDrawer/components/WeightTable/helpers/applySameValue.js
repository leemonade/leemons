export default function applySameValue({ getValues, setValue }) {
  const values = Object.entries(getValues('weights'));

  const lockedItems = values.filter(([, value]) => value.isLocked);
  const lockedWeight = lockedItems.reduce((acc, [, value]) => acc + value.weight, 0);

  const unlockedItemsCount = values.length - lockedItems.length;
  const unlockedItemWeight = Number(((1 - lockedWeight) / unlockedItemsCount).toFixed(4));

  values.forEach(([id, value]) => {
    if (!value.isLocked) {
      setValue(`weights.${id}.weight`, unlockedItemWeight, {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
  });
}
