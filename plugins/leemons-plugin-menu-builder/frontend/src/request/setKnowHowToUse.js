async function setKnowHowToUse() {
  return leemons.api('v1/menu-builder/know-how-to-use', { method: 'POST' });
}

export default setKnowHowToUse;
