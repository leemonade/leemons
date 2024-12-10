/**
 * Searches for manual activities
 * @param {object} props
 * @param {string} props.classId - The class ID in LRN format
 * @param {string} props.startDate - The start date of the activities in ISO format
 * @param {string} props.endDate - The end date of the activities in ISO format
 */
export async function searchManualActivities({ classId, startDate, endDate }) {
  const { data } = await leemons.api(
    `v1/scores/manualActivities/class/${classId}?startDate=${startDate}&endDate=${endDate}`,
    {
      method: 'GET',
    }
  );

  return data;
}
