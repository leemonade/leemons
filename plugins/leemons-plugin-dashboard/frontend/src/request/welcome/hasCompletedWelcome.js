export default function hasCompletedWelcome() {
  return leemons.api('v1/dashboard/dashboard/welcome', {
    method: 'GET',
  });
}
