import { TextEditorContext, TextEditorProvider } from '@common/context';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

export function Provider({ children }) {
  const [textEditorTools, setTextEditorTools] = useState({});
  const [textEditorProcessors, setTextEditorProcessors] = useState({});

  const setTextEditorTool = (newTools) => {
    const tools = textEditorTools;
    _.forEach(newTools, (tool) => {
      tools[tool.id] = { tool: tool.tool, props: tool.props };
    });
    setTextEditorTools(tools);
  };

  const setTextEditorProcessor = (newProcessor) => {
    const processors = newProcessor;

    _.forEach(newProcessor, (processor) => {
      if (typeof processor.processor !== 'function') {
        throw new Error('The processor must be a function');
      }
      processors[processor.id] = processor.processor;
    });

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
