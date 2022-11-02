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
import {
  TEXT_EDITOR_INPUT_DEFAULT_PROPS,
  TEXT_EDITOR_INPUT_PROP_TYPES,
} from './TextEditorInput.constants';
import { TextEditorInputStyles } from './TextEditorInput.styles';

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
  const uuid = useId();
  const { textEditorTools } = useTextEditor();

  const leemonsTools = useMemo(() => {
    const tools = [];

    if (textEditorTools) {
      keys(textEditorTools).forEach((key) => {
        if (textEditorTools[key].tool) {
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
          {toolbars.color && <ColorTool />}
          {toolbars.style && <TransformsTool />}

          {leemonsTools.map((item, i) => (
            <React.Fragment key={item.tool.id || `t-${i}`}>{item.tool}</React.Fragment>
          ))}

          {toolbars.link && <LinkTool />}
          {toolbars.heading && <HeadingsTool paragraph={false} />}
          {toolbars.list && <ListIndentTool />}
          {toolbars.align && <TextAlignTool />}
          {toolbars.formulation && <ScriptsTool />}

          {children}
        </TextEditor>
      </Box>
    </InputWrapper>
  );
};

TextEditorInput.defaultProps = TEXT_EDITOR_INPUT_DEFAULT_PROPS;
TextEditorInput.propTypes = TEXT_EDITOR_INPUT_PROP_TYPES;

// eslint-disable-next-line import/prefer-default-export
