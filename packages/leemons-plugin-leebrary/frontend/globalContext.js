import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { isFunction } from 'lodash';
import {
  LibraryGlobalContext,
  LibraryGlobalProvider,
} from '@leebrary/context/LibraryGlobalContext';
import { useTextEditor } from '@common/context';
import { LibraryTool } from '@leebrary/components';

export function Provider({ children }) {
  const { setTextEditorTool, textEditorTools } = useTextEditor();

  useEffect(() => {
    if (isFunction(setTextEditorTool) && !textEditorTools.library) {
      setTextEditorTool('library', <LibraryTool />);
    }
  }, [setTextEditorTool]);

  return <LibraryGlobalProvider value={{}}>{children}</LibraryGlobalProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default LibraryGlobalContext;
