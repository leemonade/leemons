import { FILE_TYPE_OTHER, FILE_TYPE_PATTERNS, MODULE_DESTINATION_PATTERNS, MODULE_SOURCE_PATTERNS, } from '../config/file-types';
export const getFilenameFileType = (filename, patterns) => {
    const fileType = Object.entries(patterns).find(([, pattern]) => pattern.test(filename));
    return fileType ? fileType[0] : FILE_TYPE_OTHER;
};
export const getFileType = (filename) => {
    const fileType = Object.entries(FILE_TYPE_PATTERNS).find(([, pattern]) => pattern.test(filename));
    return fileType ? fileType[0] : FILE_TYPE_OTHER;
};
export const getModuleSourceFileType = (moduleSourceFilename) => getFilenameFileType(moduleSourceFilename, MODULE_SOURCE_PATTERNS);
export const getModuleFileType = (moduleFilename) => getFilenameFileType(moduleFilename, MODULE_DESTINATION_PATTERNS);
//# sourceMappingURL=file-types.js.map