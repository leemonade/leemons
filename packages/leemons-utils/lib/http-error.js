class HttpError extends Error {
  constructor(statusCode, ...rest) {
    super(rest);
    this.statusCode = statusCode;
  }
}

/**
 * Modify the context variable of the koa to return the error with its required status code.
 * @public
 * @static
 * @param {any} ctx - Koa context
 * @param {any} errorEvent - Recovery code
 * @return {undefined}
 * */
function returnError(ctx, errorEvent) {
  ctx.status = 400;
  ctx.body = { status: 400, message: errorEvent.message };
  if (errorEvent instanceof HttpError) {
    ctx.status = errorEvent.statusCode;
    ctx.body.status = errorEvent.statusCode;
  }
}

module.exports = {
  HttpError,
  returnError,
};
