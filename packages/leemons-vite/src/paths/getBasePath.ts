import path from 'path';

export default function getBasePath(basePath: string) {
  if (!basePath) {
    return null;
  }

  const cwd = process.cwd();
  if (path.isAbsolute(basePath)) {
    return basePath;
  }

  return path.join(cwd, basePath);
};
