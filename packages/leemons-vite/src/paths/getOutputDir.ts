import path from 'path';

export default function getOutputDir(outputDir = './frontend') {
  const cwd = process.cwd();
  if (path.isAbsolute(outputDir)) {
    return outputDir;
  }

  return path.join(cwd, outputDir);
};
