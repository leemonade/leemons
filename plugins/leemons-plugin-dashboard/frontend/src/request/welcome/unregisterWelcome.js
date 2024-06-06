export default function unregisterWelcome() {
  return leemons.api('v1/dashboard/dashboard/welcome', {
    method: 'DELETE',
  });
}
