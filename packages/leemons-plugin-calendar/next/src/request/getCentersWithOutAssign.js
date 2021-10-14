async function getCentersWithOutAssign() {
  return leemons.api({
    url: 'calendar/configs/centers-with-out-assign',
    allAgents: true,
  });
}

export default getCentersWithOutAssign;
