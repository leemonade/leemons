import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import {
  LibraryGlobalContext,
  LibraryGlobalProvider,
} from '@leebrary/context/LibraryGlobalContext';
import { useTextEditor } from '@common/context';
import { LibraryTool } from '@leebrary/components';
import libraryProcessor from '@leebrary/helpers/libraryProcessor';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export function Provider({ children }) {
  const { setTextEditorTool, textEditorTools, setTextEditorProcessor, textEditorProcessors } =
    useTextEditor();

  useEffect(() => {
    if (isFunction(setTextEditorTool) && !textEditorTools.library) {
      setTextEditorTool('library', <LibraryTool />);
    }
  }, [setTextEditorTool]);

  useEffect(() => {
    if (isFunction(setTextEditorProcessor) && !textEditorProcessors.library) {
      setTextEditorProcessor('library', libraryProcessor);
    }
  }, [setTextEditorProcessor]);

  return <LibraryGlobalProvider value={{}}>{children}</LibraryGlobalProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default LibraryGlobalContext;
