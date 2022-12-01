import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { TextEditorContext, TextEditorProvider } from '@common/context';
import { CommonProvider } from '@common/context/common';
import { useStore } from '@common';

export function Provider({ children }) {
  const [store, render] = useStore({ shared: {} });
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

  function share(plugin, name, func) {
    console.log(plugin, name, func);
    if (!store.shared[plugin.toLowerCase()]) store.shared[plugin.toLowerCase()] = {};
    store.shared[plugin.toLowerCase()][name.toLowerCase()] = func;
    console.log(store);
  }

  function getShare(plugin, name) {
    console.log(store, plugin, name);
    return store.shared?.[plugin.toLowerCase()]?.[name.toLowerCase()];
  }

  function existsShare(plugin, name) {
    return !!store.shared?.[plugin.toLowerCase()]?.[name.toLowerCase()];
  }

  return (
    <TextEditorProvider value={values}>
      <CommonProvider
        value={{
          ...store,
          render,
          share,
          getShare,
          existsShare,
        }}
      >
        {children}
      </CommonProvider>
    </TextEditorProvider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default TextEditorContext;
