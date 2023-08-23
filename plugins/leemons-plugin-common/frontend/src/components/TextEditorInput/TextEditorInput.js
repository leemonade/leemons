import React, { useMemo } from 'react';
import { isEmpty, keys } from 'lodash';
import { Box, InputWrapper, useId } from '@bubbles-ui/components';
import {
  TextEditor,
  ColorTool,
  TransformsTool,
  HeadingsTool,
  ListIndentTool,
  TextAlignTool,
  ScriptsTool,
  LinkTool,
} from '@bubbles-ui/editors';
import { useTextEditor } from '@common/context';
import { useEditorLabels } from '@common/hooks/useEditorLabels';
import { TextEditorInputStyles } from './TextEditorInput.styles';
import {
  TEXT_EDITOR_INPUT_DEFAULT_PROPS,
  TEXT_EDITOR_INPUT_PROP_TYPES,
} from './TextEditorInput.constants';

export function useProcessTextEditor() {
  const { textEditorProcessors } = useTextEditor();

  const processors = React.useMemo(
    () => Object.values(textEditorProcessors),
    [textEditorProcessors]
  );

  return React.useCallback(
    async (html, oldHtml, props) =>
      processors.reduce(
        async (prevProcessorHTML, processor) => processor(await prevProcessorHTML, oldHtml, props),
        html
      ),
    [processors]
  );
}

export const TextEditorInput = ({
  label,
  description,
  toolLabels,
  help,
  error,
  required,
  value,
  onChange,
  placeholder,
  toolbars,
  children,
  editorStyles,
  editorClassname,
  ...props
}) => {
  const editorLabels = useEditorLabels();
  const uuid = useId();
  const { textEditorTools } = useTextEditor();

  const leemonsTools = useMemo(() => {
    const tools = [];

    if (textEditorTools) {
      keys(textEditorTools).forEach((key) => {
        if (textEditorTools[key].tool && toolbars[key]) {
          tools.push({ id: key, tool: textEditorTools[key].tool });
        }
      });
    }

    return tools;
  }, [toolbars, textEditorTools]);

  // ··································································
  // STYLES
  const hasError = useMemo(() => !isEmpty(error), [error]);
  const { classes, cx } = TextEditorInputStyles(
    { hasError, editorStyles },
    { name: 'TextEditorInput' }
  );

  if (isEmpty(editorLabels)) return null;

  return (
    <InputWrapper
      uuid={uuid}
      label={label}
      description={description}
      error={error}
      help={help}
      required={required}
    >
      <Box className={classes.root}>
        <TextEditor
          {...props}
          placeholder={placeholder}
          content={value}
          onChange={onChange}
          editorClassname={cx(classes.editor, editorClassname)}
        >
          {toolbars.heading && <HeadingsTool labels={editorLabels.headingsTool} />}
          {toolbars.color && <ColorTool label={editorLabels.colorTool} />}
          {toolbars.style && <TransformsTool labels={editorLabels.transformsTool} />}
          {toolbars.align && <TextAlignTool labels={editorLabels.textAlignTool} />}
          {toolbars.list && <ListIndentTool labels={editorLabels.listIndentTool} />}
          {toolbars.formulation && <ScriptsTool labels={editorLabels.scriptsTool} />}
          {toolbars.link && <LinkTool {...editorLabels.linkTool} />}

          {leemonsTools.map((item, i) =>
            React.cloneElement(item.tool, {
              key: item.tool.id || `t-${i}`,
              ...editorLabels.libraryTool,
              alignLabels: editorLabels.textAlignTool,
            })
          )}

          {children}
        </TextEditor>
      </Box>
    </InputWrapper>
  );
};

TextEditorInput.defaultProps = TEXT_EDITOR_INPUT_DEFAULT_PROPS;
TextEditorInput.propTypes = TEXT_EDITOR_INPUT_PROP_TYPES;

// eslint-disable-next-line import/prefer-default-export
