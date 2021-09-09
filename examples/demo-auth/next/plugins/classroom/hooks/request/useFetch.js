import useAsync from './useAsync';

export default (uri, options) => useAsync(() => leemons.api(uri, options));
