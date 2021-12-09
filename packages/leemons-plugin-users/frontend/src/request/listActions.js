async function listActions() {
  return leemons.api('users/action/list');
}

export default listActions;
