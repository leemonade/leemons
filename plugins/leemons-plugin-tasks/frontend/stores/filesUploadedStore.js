import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { createStore, useStore } from 'zustand';
import { uuidv4 } from '@bubbles-ui/leemons';

const FileUploadedContext = createContext(null);

function createFileUploadedStore(initialFiles = []) {
  return createStore((set) => ({
    files: new Map(initialFiles.map((file) => [file.id, file])),

    actions: {
      addNewFiles: (files, status = null) => {
        const newFiles = [];

        set((state) => {
          const newMap = new Map(state.files);

          files.forEach((file) => {
            if (!file.id || !newMap.has(file.id)) {
              const fileObj = {
                id: file.id ?? uuidv4(),
                name: file.name,
                path: file.path,
                File: file,
                status: file.status ?? status,
                leebraryId: file.leebraryId,
              };

              newMap.set(fileObj.id, fileObj);
              newFiles.push(fileObj);
            }
          });

          return { files: newMap };
        });

        return newFiles;
      },
      removeMissingFiles: (files) => {
        const removedFiles = [];

        set((state) => {
          const newMap = new Map(state.files);
          const filesMap = new Map(files.map((file) => [file.id, file]));

          newMap.values().forEach((file) => {
            if (!filesMap.has(file.id)) {
              newMap.delete(file.id);
              removedFiles.push(file);
            }
          });

          return { files: newMap };
        });

        return removedFiles;
      },
      updateLeebraryId: (id, leebraryId) =>
        set((state) => ({
          files: new Map(state.files).set(id, { ...state.files.get(id), leebraryId }),
        })),
      changeStatus: (id, newState) =>
        set((state) => ({
          files: new Map(state.files).set(id, { ...state.files.get(id), status: newState }),
        })),
    },
  }));
}

export function FileUploadProvider({ children, initialFiles }) {
  const [store] = useState(() => createFileUploadedStore(initialFiles));

  return <FileUploadedContext.Provider value={store}>{children}</FileUploadedContext.Provider>;
}

FileUploadProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialFiles: PropTypes.arrayOf(PropTypes.object),
};

FileUploadProvider.defaultProps = {
  initialFiles: [],
};

export function useFileUploadStore(selector) {
  const store = useContext(FileUploadedContext);

  if (!store) {
    throw new Error('Missing FileUploadProvider');
  }

  return useStore(store, selector);
}
