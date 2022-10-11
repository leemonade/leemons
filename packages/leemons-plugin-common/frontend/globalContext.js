import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { TextEditorContext, TextEditorProvider } from '@common/context';

export function Provider({ children }) {
  const [textEditorTools, setTextEditorTools] = useState({});

  const setTextEditorTool = (name, tool, props) => {
    const tools = { ...textEditorTools };
    tools[name] = { tool, props };
    setTextEditorTools(tools);
  };

  const values = useMemo(
    () => ({
      textEditorTools,
      setTextEditorTool,
    }),
    [textEditorTools]
  );

  return <TextEditorProvider value={values}>{children}</TextEditorProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default TextEditorContext;
