import dayjs from 'dayjs';

export function getScormDuration({ state, assignation }) {
  const cmiTotalTime = state?.cmi?.total_time;
  if (cmiTotalTime) {
    const hours = new RegExp(/(?<hours>\d*)H/).exec(cmiTotalTime)?.groups?.hours ?? 0;
    const minutes = new RegExp(/(?<minutes>\d*)M/).exec(cmiTotalTime)?.groups?.minutes ?? 0;
    const seconds = new RegExp(/(?<seconds>\d*)S/).exec(cmiTotalTime)?.groups?.seconds ?? 0;

    const secondsInAMinute = 60;
    const secondsInAnHour = secondsInAMinute * 60;

    return (
      parseFloat(seconds) +
      parseFloat(minutes) * secondsInAMinute +
      parseFloat(hours) * secondsInAnHour
    );
  }

  const { start, end } = assignation?.timestamps ?? {};
  if (start && end) {
    return dayjs(end) - dayjs(start);
  }

  return null;
}

export default getScormDuration;
