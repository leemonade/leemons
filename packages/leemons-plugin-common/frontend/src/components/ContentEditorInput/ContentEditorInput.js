import React, { useMemo, useState, useEffect } from 'react';
import { isEmpty, keys } from 'lodash';
import { Box, TextClamp, FileItemDisplay } from '@bubbles-ui/components';
import { ArrowRightIcon } from '@bubbles-ui/icons/outline';
import {
  TextEditor,
  ColorTool,
  TransformsTool,
  HeadingsTool,
  ListIndentTool,
  TextAlignTool,
  ScriptsTool,
  LinkTool,
  ButtonGroup,
} from '@bubbles-ui/editors';
import { useTextEditor } from '@common/context';
import { ContentEditorInputStyles } from './ContentEditorInput.styles';
import {
  CONTENT_EDITOR_INPUT_DEFAULT_PROPS,
  CONTENT_EDITOR_INPUT_PROP_TYPES,
} from './ContentEditorInput.constants';

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

const ContentEditorInput = ({
  error,
  required,
  value,
  onChange,
  placeholder,
  toolbars,
  children,
  labels,
  openSchema,
  useSchema,
  editorStyles,
  editorClassname,
  ...props
}) => {
  const [schema, setSchema] = useState([]);
  const [isSchemaOpened, setIsSchemaOpened] = useState(openSchema);

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
  const { classes, cx } = ContentEditorInputStyles(
    { isSchemaOpened, hasError, editorStyles },
    { name: 'ContentEditorInput' }
  );

  useEffect(() => {
    if (openSchema !== isSchemaOpened) setIsSchemaOpened(openSchema);
  }, [openSchema]);

  return (
    <Box className={classes.root}>
      {useSchema && (
        <Box className={classes.schemaContainer}>
          <Box className={classes.schemaTranslate}>
            <Box className={classes.schemaHeader}>
              <Box className={classes.schemaLabel}>{labels.schema}</Box>
              <ArrowRightIcon
                className={classes.arrowIcon}
                height={20}
                width={20}
                onClick={() => setIsSchemaOpened(!isSchemaOpened)}
              />
            </Box>
            <Box className={classes.schema}>
              {schema.map((element, index) => {
                const { level } = element.attrs;
                const isLibrary = element.type === 'library';

                // If it is a paragraph, there is no content or a title lower than h2 we do not print it.
                if (
                  element.type === 'paragraph' ||
                  (!element.content && !isLibrary) ||
                  (element.type === 'heading' && level > 2)
                )
                  return false;

                const schemaElementName = isLibrary
                  ? `${element.attrs.asset.name}.${element.attrs.asset.fileExtension}`.toLowerCase()
                  : element.content[0].text;

                return (
                  <Box key={index}>
                    {isLibrary ? (
                      <Box style={{ overflow: 'hidden', paddingLeft: 10 }}>
                        <FileItemDisplay size={18} filename={schemaElementName} />
                      </Box>
                    ) : (
                      <TextClamp lines={1}>
                        <Box className={classes[`${level === 1 ? 'title' : 'subtitle'}`]}>
                          {schemaElementName}
                        </Box>
                      </TextClamp>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
      <Box className={classes.textEditorContainer}>
        <TextEditor
          {...props}
          placeholder={placeholder}
          content={value}
          onChange={onChange}
          onSchemaChange={(json) => setSchema(json.content)}
          editorClassname={cx(classes.editor, editorClassname)}
          toolbarClassname={classes.toolbarRoot}
          editorContainerClassname={classes.editorContainer}
        >
          {toolbars.heading && <HeadingsTool label={labels.format} />}
          {toolbars.color && <ColorTool />}
          {toolbars.style && <TransformsTool />}
          {toolbars.align && <TextAlignTool />}
          {toolbars.list && <ListIndentTool />}
          {toolbars.formulation && <ScriptsTool />}

          <ButtonGroup>
            {toolbars.link && <LinkTool />}
            {leemonsTools.map((item) => item.tool)}
          </ButtonGroup>

          {children}
        </TextEditor>
      </Box>
    </Box>
  );
};

ContentEditorInput.defaultProps = CONTENT_EDITOR_INPUT_DEFAULT_PROPS;
ContentEditorInput.propTypes = CONTENT_EDITOR_INPUT_PROP_TYPES;

export default ContentEditorInput;
