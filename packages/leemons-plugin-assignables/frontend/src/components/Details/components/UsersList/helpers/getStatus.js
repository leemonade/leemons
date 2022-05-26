import dayjs from 'dayjs';

export default function getStatus(studentData, instanceData) {
  // EN: This values are keys for the localization object prefixPN('activity_status')
  // ES: Estos valores son claves para el objeto de traducción prefixPN('activity_status')

  if (studentData.timestamps?.end) {
    if (
      !instanceData.dates?.alwaysAvailable &&
      instanceData.dates?.deadline &&
      dayjs(studentData.timestamps?.end).isAfter(dayjs(instanceData.dates?.deadline))
    ) {
      return 'late';
    }
    return 'completed';
  }
  if (studentData.timestamps?.start) {
    return 'ongoing';
  }
  if (studentData.timestamps?.open) {
    return 'opened';
  }
  return 'notOpened';
}
