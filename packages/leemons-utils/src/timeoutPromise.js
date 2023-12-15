function timeoutPromise(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

module.exports = { timeoutPromise };
