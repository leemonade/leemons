import useAsync from './useAsync';

export default (uri, options) =>
  useAsync(() => leemons.api({ url: uri, allAgents: true }, options));
