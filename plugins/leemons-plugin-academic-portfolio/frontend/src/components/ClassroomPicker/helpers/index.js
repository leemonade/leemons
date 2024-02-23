function convertTimeToMinutes(time) {
  if (!time) return 0;
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function checkCollision(schedule1, schedule2) {
  const dayMatch = schedule1.day === schedule2.day;
  const start1 = convertTimeToMinutes(schedule1.start);
  const end1 = convertTimeToMinutes(schedule1.end);
  const start2 = convertTimeToMinutes(schedule2.start);
  const end2 = convertTimeToMinutes(schedule2.end);
  const timeOverlap = start1 < end2 && end1 > start2;

  return dayMatch && timeOverlap;
}

const transformData = (dataClasses) => {
  let hasCollisions = false;
  const data = dataClasses.map((item, index, array) => {
    const allDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayAbbreviations = {
      // cambiar valores a variables de texto
      monday: 'Mo',
      tuesday: 'Tu',
      wednesday: 'We',
      thursday: 'Th',
      friday: 'Fr',
      saturday: 'Sa',
      sunday: 'Su',
    };
    const scheduleMap = item.schedule.reduce((acc, { day, start, end }) => {
      const key = `${start}-${end}`;
      if (!acc[key]) {
        acc[key] = [day];
      } else {
        acc[key].push(day);
      }
      return acc;
    }, {});

    const collideWith = array.reduce((acc, currentItem, currentIndex) => {
      if (index !== currentIndex) {
        item.schedule.forEach((itemSchedule) => {
          currentItem.schedule.forEach((currentItemSchedule) => {
            if (checkCollision(itemSchedule, currentItemSchedule)) {
              hasCollisions = true;
              acc.push(currentItem.id);
            }
          });
        });
      }
      return acc;
    }, []);

    const scheduleArray = Object.entries(scheduleMap).map(([key, days]) => {
      const [start, end] = key.split('-');
      const sortedDays = days.sort((a, b) => allDays.indexOf(a) - allDays.indexOf(b));
      const daysAbbreviated = sortedDays.map((day) => dayAbbreviations[day]);

      let daysStr = '';
      let lastDayIndex = -2;
      let tempArray = [];

      daysAbbreviated.forEach((day, i) => {
        const currentIndex = allDays.indexOf(sortedDays[i]);
        if (lastDayIndex + 1 === currentIndex) {
          tempArray.push(day);
        } else {
          if (tempArray.length > 1) {
            daysStr += `${tempArray[0]} - ${tempArray[tempArray.length - 1]}, `;
          } else if (tempArray.length === 1) {
            daysStr += `${tempArray[0]}, `;
          }
          tempArray = [day];
        }
        lastDayIndex = currentIndex;
      });

      if (tempArray.length > 1) {
        daysStr += `${tempArray[0]} - ${tempArray[tempArray.length - 1]}`;
      } else if (tempArray.length === 1) {
        daysStr += `${tempArray[0]}`;
      }

      daysStr = daysStr.endsWith(', ') ? daysStr.slice(0, -2) : daysStr;

      return `${daysStr}, ${start}-${end}`;
    });

    return {
      value: item?.id,
      label: item?.subject?.name,
      subjectName: item?.subject?.name,
      subjectColor: item?.subject?.color,
      subjectIcon: item?.subject?.icon,
      schedule: scheduleArray,
      collideWith,
    };
  });

  return { data, hasCollisions };
};

export { transformData };
