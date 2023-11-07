async function getCentersWithOutAssign() {
  return leemons.api('v1/calendar/calendar/configs/centers-with-out-assign', {
    allAgents: true,
  });
}

export default getCentersWithOutAssign;
