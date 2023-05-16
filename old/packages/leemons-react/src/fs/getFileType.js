// Get which file type is a file

const fileType = {
  SymbolicLink: 'symbolicLink',
  Directory: 'directory',
  File: 'file',
  Null: 'null',
};

module.exports = function getFileType(file) {
  if (file.isSymbolicLink()) {
    return fileType.SymbolicLink;
  }
  if (file.isDirectory()) {
    return fileType.Directory;
  }
  if (file.isFile()) {
    return fileType.File;
  }

  return fileType.Null;
};
