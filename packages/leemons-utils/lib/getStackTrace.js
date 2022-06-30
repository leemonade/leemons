function getStackTrace(index) {
  /*
   * This code is based on v8 docs.
   * See https://v8.dev/docs/stack-trace-api for more info.
   */

  // Capture original prepareStackTrace
  const { prepareStackTrace } = Error;

  // When the stack asks to be prepared, just return the stackTrace
  Error.prepareStackTrace = (error, stackTrace) => stackTrace;
  // Create a new error for getting the stack
  const err = new Error();

  // Get the stackTrace with the custom Error.prepareStackTrace
  const { stack } = err;

  // Restore default prepareStackTrace
  Error.prepareStackTrace = prepareStackTrace;

  if (typeof index === 'number') {
    if (!stack[index]) {
      return null;
    }
    return {
      fileName: stack[index].getFileName(),
      lineNumber: stack[index].getLineNumber(),
      columnNumber: stack[index].getColumnNumber(),
      functionName: stack[index].getFunctionName(),
    };
  }
  return stack.map((trace) => ({
    fileName: trace.getFileName(),
    lineNumber: trace.getLineNumber(),
    columnNumber: trace.getColumnNumber(),
    functionName: trace.getFunctionName(),
  }));
}

module.exports = getStackTrace;
