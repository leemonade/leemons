async function getPlatformName() {
  return leemons.api('v1/users/platform/name');
}

export default getPlatformName;
