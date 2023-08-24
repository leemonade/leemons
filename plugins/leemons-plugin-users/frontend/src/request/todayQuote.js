async function todayQuote() {
  return leemons.api('users/init/today-quote', {
    method: 'GET',
  });
}

export default todayQuote;
