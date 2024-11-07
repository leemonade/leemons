import getPluginPaths from "./getPluginPaths";
import listPluginsFromPackageJson from "./listPluginsFromPackageJson";

const FORCE_ORDER = {
  'common': 0,
  'layout': 1,
};

interface GetPluginsOptions {
  app: string;
}

export default async function getPlugins({ app }: GetPluginsOptions) {
  const plugins = await listPluginsFromPackageJson({ app });
  const paths = await Promise.all(plugins.map(getPluginPaths));


  return paths.sort((pluginA, pluginB) => {
    const aOrder = FORCE_ORDER[pluginA.name] ?? Number.MAX_SAFE_INTEGER;
    const bOrder = FORCE_ORDER[pluginB.name] ?? Number.MAX_SAFE_INTEGER;

    return aOrder - bOrder;
  });
}
