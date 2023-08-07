import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { createContext, useCallback, useEffect, useState } from 'react';
import { apiUrl as API_URL } from './apiURL';

const context = createContext();

export default context;
export const { Consumer: GlobalConsumer } = context;
context.displayName = 'Global Context';

// Leemons Api is an api fetcher with middlewares
class LeemonsApi {
  #reqMiddlewares;

  #resMiddlewares;

  #resErrorMiddlewares;

  constructor() {
    this.#reqMiddlewares = [];
    this.#resMiddlewares = [];
    this.#resErrorMiddlewares = [];
    this.api.useReq = this.#use('req');
    this.api.useRes = this.#use('res');
    this.api.useResError = this.#use('resError');
    this.api.hasReq = this.#apiHasReqMiddleware;
    this.api.hasRes = this.#apiHasResMiddleware;
    this.apiCache = {};
    this.apiWaitToFinish = {};

    this.returnWhenWaitFinish = (waitKey) =>
      new Promise((resolve, reject) => {
        this.apiWaitToFinish[waitKey].waiting++;
        const check = () => {
          if (this.apiWaitToFinish[waitKey].finish) {
            const { isError } = this.apiWaitToFinish[waitKey];
            const response = _.cloneDeep(this.apiWaitToFinish[waitKey].response);
            this.apiWaitToFinish[waitKey].waiting--;
            if (isError) {
              reject(response);
            } else {
              resolve(response);
            }
          } else {
            window.requestAnimationFrame(check);
          }
        };
        window.requestAnimationFrame(check);
      });
    this.removeWhenNoWaits = (waitKey) => {
      let times = 0;
      const check = () => {
        if (this.apiWaitToFinish[waitKey].finish && !this.apiWaitToFinish[waitKey].waiting) {
          delete this.apiWaitToFinish[waitKey];
        } else if (times < 60) {
          times++;
          window.requestAnimationFrame(check);
        } else {
          delete this.apiWaitToFinish[waitKey];
        }
      };
      window.requestAnimationFrame(check);
    };
  }

  api = async (url, options) => {
    const ctx = { url, options, middlewares: [] };
    let waitKey = null;
    try {
      await this.#callMiddleware(this.#reqMiddlewares, 0, ctx);

      let cache = null;
      let cacheKey = null;
      if (ctx.options?.cache) {
        cache = ctx.options.cache;
        cacheKey = JSON.stringify({
          url: `${global.leemons.apiUrl}/api/${ctx.url}`,
          options: ctx.options,
        });
        delete ctx.options.cache;
        if (this.apiCache[cacheKey]) {
          const now = new Date();
          if (now > this.apiCache[cacheKey].endDate) {
            delete this.apiCache[cacheKey];
          } else {
            return this.apiCache[cacheKey].response;
          }
        }
      }

      // if (ctx.options?.waitToFinish) {
      const formDataValues = {};
      if (ctx.options.body instanceof FormData) {
        for (const [key, value] of ctx.options.body.entries()) {
          formDataValues[key] = ctx.options.body.getAll(key);
        }
      }
      waitKey = JSON.stringify({
        url: `${global.leemons.apiUrl}/api/${ctx.url}`,
        options: ctx.options,
        formDataValues,
      });
      delete ctx.options.waitToFinish;
      if (this.apiWaitToFinish[waitKey]) {
        return await this.returnWhenWaitFinish(waitKey);
      }
      this.apiWaitToFinish[waitKey] = {
        finish: false,
        isError: false,
        response: null,
        waiting: 0,
      };

      // }

      const response = await fetch(`${global.leemons.apiUrl}/api/${ctx.url}`, ctx.options);

      const responseCtx = { middlewares: [], response };
      await this.#callMiddleware(this.#resMiddlewares, 0, responseCtx);

      if (cacheKey) {
        const ms = Date.now();
        let ttl = cache;
        if (!_.isNumber(ttl)) {
          ttl = cache.ttl;
        }
        this.apiCache[cacheKey] = {
          endDate: new Date(ms + ttl),
          response: responseCtx.response,
        };
      }

      if (waitKey) {
        this.apiWaitToFinish[waitKey].finish = true;
        this.apiWaitToFinish[waitKey].response = responseCtx.response;
        this.removeWhenNoWaits(waitKey);
      }

      return responseCtx.response;
    } catch (response) {
      const responseCtx = { middlewares: [], response };
      await this.#callMiddleware(this.#resErrorMiddlewares, 0, responseCtx);
      if (waitKey) {
        this.apiWaitToFinish[waitKey].finish = true;
        this.apiWaitToFinish[waitKey].isError = true;
        this.apiWaitToFinish[waitKey].response = responseCtx.response;
        this.removeWhenNoWaits(waitKey);
      }
      throw responseCtx.response;
    }
  };

  #apiHasReqMiddleware = (f) => this.#reqMiddlewares.includes(f);

  #apiHasResMiddleware = (f) => this.#resMiddlewares.includes(f);

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

  #use = (type) => (middleware) => {
    if (type === 'req') {
      this.#reqMiddlewares.push(middleware);
    } else if (type === 'res') {
      this.#resMiddlewares.push(middleware);
    } else if (type === 'resError') {
      this.#resErrorMiddlewares.push(middleware);
    }
  };
}

export function Provider({ children }) {
  const { api } = new LeemonsApi();

  const apiContentTypeMiddleware = useCallback((ctx) => {
    if (!ctx.options) ctx.options = {};
    if (ctx.options && !ctx.options.headers) ctx.options.headers = {};
    if (ctx.options && !ctx.options.headers['content-type'] && !ctx.options.headers['Content-Type'])
      ctx.options.headers['content-type'] = 'application/json';
    if (
      ctx.options &&
      _.isObject(ctx.options.body) &&
      ctx.options.headers['content-type'] === 'application/json'
    ) {
      ctx.options.body = JSON.stringify(ctx.options.body);
    }
    if (ctx.options.headers['content-type'] === 'none') {
      delete ctx.options.headers['content-type'];
    }
  }, []);

  const apiUrlParserMiddleware = useCallback((ctx) => {
    if (ctx.options && _.isObject(ctx.options.params)) {
      let goodUrl = ctx.url;
      _.forIn(ctx.options.params, (value, key) => {
        goodUrl = _.replace(goodUrl, `:${key}`, value);
      });
      ctx.url = goodUrl;
    }
  }, []);

  const apiResponseParserMiddleware = useCallback(async (ctx) => {
    if (ctx.response.status >= 500) {
      // eslint-disable-next-line no-throw-literal
      throw { status: ctx.response.status, message: ctx.response.statusText };
    }
    if (ctx.response.status >= 400) {
      throw await ctx.response.json();
    }
    ctx.response = await ctx.response.json();
  }, []);

  useEffect(() => {
    api.useReq(apiContentTypeMiddleware);
    api.useReq(apiUrlParserMiddleware);
    api.useRes(apiResponseParserMiddleware);
  }, []);

  let apiUrl = API_URL;

  if (window.customEnv?.apiUrl) {
    apiUrl = window.customEnv.apiUrl;
  }

  const [value, setValue] = useState({
    leemons: {
      api,
      log: console,
      version: '1.0.0',
      apiUrl,
    },
  });

  global.leemons = value.leemons;

  const providerValue = { ...value, setValue };
  return <context.Provider value={providerValue}>{children}</context.Provider>;
}

Provider.propTypes = {
  children: PropTypes.element,
};
