/**
 * Returns a promise that resolves after the specified time
 * @param time - The time to wait in milliseconds
 * @returns A promise that resolves after the specified time
 */
function timeoutPromise(time: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

export { timeoutPromise };
