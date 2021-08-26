class HttpErrorPermissions extends Error {
  constructor(statusCode, allowedPermissions, ...rest) {
    super(rest);
    this.statusCode = statusCode;
    this.allowedPermissions = allowedPermissions;
  }
}

class HttpErrorWithCustomCode extends Error {
  constructor(statusCode, code, ...rest) {
    super(rest);
    this.statusCode = statusCode;
    this.code = code;
  }
}

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
  if (
    errorEvent instanceof HttpError ||
    errorEvent instanceof HttpErrorWithCustomCode ||
    errorEvent instanceof HttpErrorPermissions
  ) {
    ctx.status = errorEvent.statusCode;
    ctx.body.status = errorEvent.statusCode;
    if (errorEvent.allowedPermissions) {
      ctx.body.allowedPermissions = errorEvent.allowedPermissions;
    }
    if (errorEvent.code) {
      ctx.body.code = errorEvent.code;
    }
  }
}

module.exports = {
  HttpError,
  HttpErrorWithCustomCode,
  HttpErrorPermissions,
  returnError,
};
