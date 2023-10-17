async function getRolesForCenter(center) {
  return leemons.api(`users/roles-for-center/${center}`);
}

export default getRolesForCenter;
