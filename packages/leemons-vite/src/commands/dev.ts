import setupEnvironment from "../environment/setupEnvironment";
import getPaths from "../paths/getPaths";
import getAliases from "../plugins/getAliases";
import getPlugins from "../plugins/getPlugins";
import getPublicDirectories from "../plugins/getPublicDirectories";

interface DevOptions {
  port?: string;

  app?: string;
  build?: string;
  output?: string;
  base?: string;
}

export default async function dev({ port, app, build, output, base }: DevOptions) {
  setupEnvironment({ port });

  const {appDir, outputDir} = getPaths({ app, build, output, base });

  const plugins = await getPlugins({ app: appDir });
  const publicDirectories = getPublicDirectories({ dir: outputDir, plugins });
  const aliases = getAliases({ dir: outputDir, plugins });

  console.log(aliases);
}
