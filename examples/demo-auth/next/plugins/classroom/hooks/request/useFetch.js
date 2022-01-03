import useAsync from './useAsync';

export default (uri, options) =>
  useAsync((_uri, _options) => leemons.api({ url: _uri, allAgents: true }, _options), uri, options);
