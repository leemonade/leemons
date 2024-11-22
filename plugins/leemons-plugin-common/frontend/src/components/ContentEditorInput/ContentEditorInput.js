import { useEffect, forwardRef } from 'react';

import { Box } from '@bubbles-ui/components';
import { MathTool } from '@content-creator/components';
import { keys, isEmpty } from 'lodash';

import {
  CONTENT_EDITOR_INPUT_DEFAULT_PROPS,
  CONTENT_EDITOR_INPUT_PROP_TYPES,
} from './ContentEditorInput.constants';
import { ContentEditorInputStyles } from './ContentEditorInput.styles';
import { Schema } from './components/Schema/Schema';
import { TextEditorContent } from './components/TextEditorContent/TextEditorContent';
import { useContentEditorStore } from './context/ContentEditorInput.context';

import { useTextEditor } from '@common/context';
import { useEditorLabels } from '@common/hooks/useEditorLabels';

const ContentEditorInput = forwardRef(
  (
    {
      toolbars,
      children,
      schemaLabel,
      openSchema,
      useSchema,
      editorStyles,
      Footer,
      toolbarPortal,
      compact,
      ...props
    },
    ref
  ) => {
    const editorLabels = useEditorLabels();
    const setIsSchemaOpened = useContentEditorStore((state) => state.setIsSchemaOpened);

    const { setTextEditorTool, textEditorTools } = useTextEditor();

    useEffect(() => {
      setTextEditorTool([{ id: 'math', tool: <MathTool /> }]);
    }, []);

    const leemonsTools = () => {
      const tools = [];
      if (textEditorTools) {
        keys(textEditorTools).forEach((key) => {
          if (textEditorTools[key].tool && toolbars[key]) {
            tools.push({
              id: key,
              tool: textEditorTools[key].tool,
              props: textEditorTools[key].props,
            });
          }
        });
      }

      return tools;
    };

    // ··································································
    // STYLES

    const { classes } = ContentEditorInputStyles(
      { hasFooter: !!Footer },
      { name: 'ContentEditorInput' }
    );

    useEffect(() => {
      setIsSchemaOpened(openSchema);
    }, [openSchema]);

    if (isEmpty(editorLabels)) return null;

    return (
      <Box className={classes.root}>
        {useSchema && <Schema schemaLabel={schemaLabel} compact={compact} />}
        <Box className={classes.textEditorContainer} ref={ref}>
          <TextEditorContent
            {...props}
            leemonsTools={leemonsTools()}
            toolbars={toolbars}
            useSchema={useSchema}
            editorLabels={editorLabels}
            toolbarPortal={toolbarPortal}
            compact={compact}
          >
            {children}
          </TextEditorContent>
          {!!Footer && Footer}
        </Box>
      </Box>
    );
  }
);

ContentEditorInput.defaultProps = CONTENT_EDITOR_INPUT_DEFAULT_PROPS;
ContentEditorInput.propTypes = CONTENT_EDITOR_INPUT_PROP_TYPES;
ContentEditorInput.displayName = 'ContentEditorInput';

export default ContentEditorInput;
