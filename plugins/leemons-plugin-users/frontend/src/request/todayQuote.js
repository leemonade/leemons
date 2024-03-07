async function todayQuote() {
  return leemons.api('v1/users/init/today-quote', {
    method: 'GET',
  });
}

export default todayQuote;
