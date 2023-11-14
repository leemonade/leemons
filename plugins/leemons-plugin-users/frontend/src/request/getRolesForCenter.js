async function getRolesForCenter(center) {
  return leemons.api(`v1/users/roles-for-center/${center}`);
}

export default getRolesForCenter;
