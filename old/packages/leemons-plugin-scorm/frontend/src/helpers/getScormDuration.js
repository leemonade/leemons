import dayjs from 'dayjs';

export function getScormDuration({ state, assignation }) {
  const cmi2004TotalTime = state?.cmi?.total_time;
  const cmi12TotalTime = state?.cmi?.core?.total_time;

  let hours;
  let minutes;
  let seconds;

  if (cmi2004TotalTime) {
    hours = new RegExp(/(?<hours>\d*)H/).exec(cmi2004TotalTime)?.groups?.hours ?? '0';
    minutes = new RegExp(/(?<minutes>\d*)M/).exec(cmi2004TotalTime)?.groups?.minutes ?? '0';
    seconds = new RegExp(/(?<seconds>\d*)S/).exec(cmi2004TotalTime)?.groups?.seconds ?? '0';
  } else if (cmi12TotalTime) {
    const { groups } = new RegExp(/(?<hours>\d*):(?<minutes>\d*):(?<seconds>\d*)/).exec(
      cmi12TotalTime
    );

    hours = groups.hours ?? '0';
    minutes = groups.minutes ?? '0';
    seconds = groups.seconds ?? '0';
  } else {
    const { start, end } = assignation?.timestamps ?? {};
    if (start && end) {
      return dayjs(end) - dayjs(start);
    }
  }

  const secondsInAMinute = 60;
  const secondsInAnHour = secondsInAMinute * 60;

  return (
    parseFloat(seconds) +
    parseFloat(minutes) * secondsInAMinute +
    parseFloat(hours) * secondsInAnHour
  );
}

export default getScormDuration;
