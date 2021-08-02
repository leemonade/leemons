async function setKnowHowToUse() {
  return leemons.api('menu-builder/know-how-to-use', { method: 'POST' });
}

export default setKnowHowToUse;
