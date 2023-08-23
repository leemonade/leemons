import { TextEditorContext, TextEditorProvider } from '@common/context';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

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

  React.useEffect(() => {
    // TODO: Buscar todas las imagenes y poner bien la url
    const interval = setInterval(() => {
      const elements = document.querySelectorAll('[src]');

      _.forEach(elements, (element) => {
        const src = element.getAttribute('src');
        if (src.startsWith('/api')) {
          // console.log('Element', element);
          // eslint-disable-next-line no-param-reassign
          element.src = leemons.apiUrl + src;
        }
      });
    }, 1000 / 20);
    return () => {
      clearInterval(interval);
    };
  });

  return <TextEditorProvider value={values}>{children}</TextEditorProvider>;
}

Provider.propTypes = {
  children: PropTypes.node,
};

export default TextEditorContext;
