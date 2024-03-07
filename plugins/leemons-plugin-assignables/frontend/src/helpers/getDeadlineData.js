const getDeadlineData = (deadline, visualizationDate, labels) => {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const visualizationDateObj = new Date(visualizationDate);

  if (!deadline) {
    return { date: labels?.noDeadline, status: labels?.opened };
  }

  if (visualizationDate && now < visualizationDateObj) {
    return { date: deadlineDate.toLocaleDateString(), status: labels?.programmed };
  }

  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays > 5) {
    return { date: deadlineDate.toLocaleDateString(), status: labels?.opened };
  }

  if (diffDays > 0) {
    return {
      date: deadlineDate.toLocaleDateString(),
      status: labels?.daysRemaining?.replace('{{count}}', diffDays),
    };
  }

  const diffHours = Math.ceil((deadlineDate - now) / (1000 * 60 * 60));

  if (diffHours > 0) {
    return {
      date: `${deadlineDate.toLocaleDateString()} - ${deadlineDate.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      status: labels?.hoursRemaining?.replace('{{count}}', diffHours),
    };
  }

  return {
    date: `${deadlineDate.toLocaleDateString()} - ${deadlineDate.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    })}`,
    status: labels?.late,
  };
};

export default getDeadlineData;
export { getDeadlineData };
