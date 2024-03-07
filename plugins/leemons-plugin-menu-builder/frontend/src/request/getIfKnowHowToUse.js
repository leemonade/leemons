async function getIfKnowHowToUse() {
  return leemons.api('v1/menu-builder/know-how-to-use');
}

export default getIfKnowHowToUse;
