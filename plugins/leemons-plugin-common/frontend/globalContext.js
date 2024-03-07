import { TextEditorContext, TextEditorProvider } from '@common/context';
import { LibraryTool } from '@leebrary/components';
import libraryProcessor from '@leebrary/helpers/libraryProcessor';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

const DEFAULT_TOOLS = {
  library: { tool: <LibraryTool /> },
};
const DEFAULT_PROCESSORS = {
  library: { processor: libraryProcessor },
};

export function Provider({ children }) {
  const [textEditorTools, setTextEditorTools] = useState(DEFAULT_TOOLS);
  const [textEditorProcessors, setTextEditorProcessors] = useState(DEFAULT_PROCESSORS);

  const setTextEditorTool = (newTools) => {
    const tools = _.cloneDeep(textEditorTools);
    _.forEach(newTools, (tool) => {
      tools[tool.id] = { tool: tool.tool, props: tool.props };
    });
    setTextEditorTools(tools);
  };

  const setTextEditorProcessor = (newProcessor) => {
    const processors = _.cloneDeep(newProcessor);

    _.forEach(newProcessor, (processor) => {
      if (typeof processor.processor !== 'function') {
        throw new Error('The processor must be a function');
      }
      processors[processor.id] = processor.processor;
    });

    setTextEditorProcessors(processors);
  };

  const setEditorDefault = () => {
    setTextEditorTools(() => DEFAULT_TOOLS);
    setTextEditorProcessors(() => DEFAULT_PROCESSORS);
  };

  const values = useMemo(
    () => ({
      textEditorTools,
      setTextEditorTool,
      textEditorProcessors,
      setTextEditorProcessor,
      setEditorDefault,
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
