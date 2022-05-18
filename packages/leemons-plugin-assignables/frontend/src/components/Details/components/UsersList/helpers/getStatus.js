import dayjs from 'dayjs';

export default function getStatus(studentData, instanceData) {
  if (studentData.timestamps?.end) {
    if (
      !instanceData.dates?.alwaysAvailable &&
      instanceData.dates?.deadline &&
      !dayjs(studentData.timestamps?.end).isAfter(dayjs(instanceData.dates?.deadline))
    ) {
      return 'LATE';
    }
    return 'COMPLETED';
  }
  if (studentData.timestamps?.start) {
    return 'ONGOING';
  }
  if (studentData.timestamps?.opened) {
    return 'OPENED';
  }
  return 'NOT OPENED';
}
