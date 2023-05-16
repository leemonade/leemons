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
