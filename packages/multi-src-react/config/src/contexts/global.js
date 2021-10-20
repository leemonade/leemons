import _ from 'lodash';
import React, { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const context = createContext();

export default context;
export const { Consumer: GlobalConsumer } = context;
context.displayName = 'Global Context';

// Leemons Api is an api fetcher with middlewares
class LeemonsApi {
  #reqMiddlewares;

  #resMiddlewares;

  constructor() {
    this.#reqMiddlewares = [];
    this.#resMiddlewares = [];
    this.api.useReq = this.#use('req');
    this.api.useRes = this.#use('res');
  }

  api = async (url, options) => {
    const ctx = { url, options, middlewares: [] };

    await this.#callMiddleware(this.#reqMiddlewares, 0, ctx);

    const response = await fetch(`${window.location.origin}/api/${ctx.url}`, ctx.options);

    const responseCtx = { middlewares: [], response };
    await this.#callMiddleware(this.#resMiddlewares, 0, responseCtx);

    return responseCtx.response;
  };

  #callMiddleware = async (middlewares, i, ctx) => {
    if (!ctx.middlewares[i]) {
      ctx.middlewares[i] = true;
      const next = middlewares[i + 1]
        ? () => this.#callMiddleware(middlewares, i + 1, ctx)
        : () => {};
      const middleware = middlewares[i] ? middlewares[i] : () => {};
      await middleware(ctx, next);
      await next();
    }
  };

  #use = (type) => (middleware) =>
    (type === 'req' ? this.#reqMiddlewares : this.#resMiddlewares).push(middleware);
}

export function Provider({ children }) {
  const { api } = new LeemonsApi();

  const apiContentTypeMiddleware = useCallback((ctx) => {
    if (!ctx.options) ctx.options = {};
    if (ctx.options && !ctx.options.headers) ctx.options.headers = {};
    if (ctx.options && !ctx.options.headers['content-type'] && !ctx.options.headers['Content-Type'])
      ctx.options.headers['content-type'] = 'application/json';
    if (ctx.options && _.isObject(ctx.options.body)) {
      ctx.options.body = JSON.stringify(ctx.options.body);
    }
  }, []);

  useEffect(() => {
    api.useReq(apiContentTypeMiddleware);
  }, []);

  const [value, setValue] = useState({
    leemons: {
      api,
      version: '1.0.0',
    },
  });

  global.leemons = value.leemons;
  return <context.Provider value={{ ...value, setValue }}>{children}</context.Provider>;
}

Provider.propTypes = {
  children: PropTypes.element,
};
