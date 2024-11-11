import dayjs from 'dayjs';

export default function getStatus(assignation) {
  const { instance } = assignation;

  const { alwaysAvailable: isAlwaysAvailable } = instance ?? {};

  const now = dayjs();
  const startDate = dayjs(instance?.dates?.start || null);
  const deadline = dayjs(instance?.dates?.deadline || null);
  const closeDate = dayjs(instance?.dates?.closed || null);

  const startTime = dayjs(assignation?.timestamps?.start || null);
  const endTime = dayjs(assignation?.timestamps?.end || null);

  const activityHasStarted = isAlwaysAvailable || (startDate.isValid() && !now.isBefore(startDate));
  const activityHasBeenClosed = isAlwaysAvailable
    ? closeDate.isValid() && !now.isBefore(closeDate)
    : deadline.isValid() && !now.isBefore(deadline);

  const studentHasStarted = startTime.isValid();
  const studentHasFinished = endTime.isValid();

  return {
    activityHasStarted,
    activityHasBeenClosed,
    studentHasStarted,
    studentHasFinished,
  };
}
