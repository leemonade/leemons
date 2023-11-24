const getColorByDateRange = (deadlineDate, visualizationDate) => {
  const currentDate = new Date();
  const start = new Date(visualizationDate);
  const end = new Date(deadlineDate);

  if (!deadlineDate) return '#5CBC6A';

  if (currentDate < start) return '#5CBC6A';

  const totalDuration = end - start;
  const remainingDuration = end - currentDate;
  const percentageRemaining = (remainingDuration / totalDuration) * 100;

  if (percentageRemaining > 50) return '#5CBC6A';

  if (percentageRemaining <= 49 && percentageRemaining > 30) return '#F39C12';

  return '#D13B3B';
};

export default getColorByDateRange;
export { getColorByDateRange };
