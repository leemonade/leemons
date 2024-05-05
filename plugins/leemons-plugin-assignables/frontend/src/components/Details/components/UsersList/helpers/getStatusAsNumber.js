import dayjs from 'dayjs';

export default function getStatusAsNumber(student, instance) {
  const finishDate = dayjs(student?.timestamps?.end || null);
  const startDate = dayjs(student?.timestamps?.start || null);
  const openDate = dayjs(student?.timestamps?.open || null);
  const isEvaluated = student?.grades?.length > 0;

  if (isEvaluated) {
    return 3;
  }

  if (finishDate.isValid()) {
    return 2;
  }

  if (startDate.isValid()) {
    return 1;
  }

  if (openDate.isValid()) {
    return 0;
  }

  return -1;
}
