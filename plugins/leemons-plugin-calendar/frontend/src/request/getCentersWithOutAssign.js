async function getCentersWithOutAssign() {
  return leemons.api('calendar/configs/centers-with-out-assign', {
    allAgents: true,
  });
}

export default getCentersWithOutAssign;
