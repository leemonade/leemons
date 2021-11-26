export default function getUTCString(date) {
  const month = (parseInt(date.getUTCMonth().toString(), 10) + 1).toString();
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  return `${date.getUTCFullYear()}-${month.toString().length === 1 ? `0${month}` : month}-${
    day.toString().length === 1 ? `0${day}` : day
  } ${hours.toString().length === 1 ? `0${hours}` : hours}:${
    minutes.toString().length === 1 ? `0${minutes}` : minutes
  }:${seconds.toString().length === 1 ? `0${seconds}` : seconds}`;
}
