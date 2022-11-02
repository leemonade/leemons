import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextEditorContext, TextEditorProvider } from '@common/context';

export function Provider({ children }) {
  const [textEditorTools, setTextEditorTools] = useState({});
  const [textEditorProcessors, setTextEditorProcessors] = useState({});

  const setTextEditorTool = (name, tool, props) => {
    const tools = { ...textEditorTools };
    tools[name] = { tool, props };
    setTextEditorTools(tools);
  };

  const setTextEditorProcessor = (name, processor) => {
    if (typeof processor !== 'function') {
      throw new Error('The processor must be a function');
    }

    const processors = { ...textEditorProcessors };
    processors[name] = processor;
    setTextEditorProcessors(processors);
  };

  const values = useMemo(
    () => ({
      textEditorTools,
      setTextEditorTool,
      textEditorProcessors,
      setTextEditorProcessor,
    }),
    [textEditorTools]
  );

  return <TextEditorProvider value={values}>{children}</TextEditorProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default TextEditorContext;
