import getAppDir from "./getAppDir";
import getBasePath from "./getBasePath";
import getBuildDir from "./getBuildDir";
import getOutputDir from "./getOutputDir";

interface GetPathsOptions {
  app?: string;
  build?: string;
  output?: string;
  base: string;
}

export default function getPaths({ app, build, output, base }: GetPathsOptions) {
  return {
    appDir: getAppDir(app),
    buildDir: getBuildDir(build),
    outputDir: getOutputDir(output),
    basePath: getBasePath(base),
  };
}
