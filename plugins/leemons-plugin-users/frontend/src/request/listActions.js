async function listActions() {
  return leemons.api('v1/users/actions/list');
}

export default listActions;
