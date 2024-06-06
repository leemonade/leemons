export default function registerWelcome() {
  return leemons.api('v1/dashboard/dashboard/welcome', {
    method: 'POST',
  });
}
