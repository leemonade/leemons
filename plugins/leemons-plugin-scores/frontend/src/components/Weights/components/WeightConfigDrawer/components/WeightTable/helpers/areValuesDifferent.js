export default function areValuesDifferent({ getValues, excludeLocked }) {
  let values = Object.values(getValues('weights'));

  if (excludeLocked) {
    values = values.filter((value) => !value.isLocked);
  }

  return values.some((value) => value.weight !== values[0].weight);
}
