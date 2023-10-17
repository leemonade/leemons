import React, { useMemo, useState, useEffect } from 'react';
import { keys, isEmpty } from 'lodash';
import { Box, IconButton } from '@bubbles-ui/components';
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
import { useEditorLabels } from '@common/hooks/useEditorLabels';
import { ExpandDiagonalIcon, ShrinkIcon } from '@bubbles-ui/icons/outline';
import { ContentEditorInputStyles } from './ContentEditorInput.styles';
import {
  CONTENT_EDITOR_INPUT_DEFAULT_PROPS,
  CONTENT_EDITOR_INPUT_PROP_TYPES,
} from './ContentEditorInput.constants';
import { Schema } from './components/Schema/Schema';

const CONTENT_EDITOR_ACCEPTED_TAGS = [{ type: 'library', updateWithoutContent: true }];

const ContentEditorInput = ({
  error,
  required,
  value,
  onChange,
  placeholder,
  toolbars,
  children,
  toolLabels,
  schemaLabel,
  openSchema,
  useSchema,
  editorStyles,
  editorClassname,
  openLibraryModal,
  ...props
}) => {
  const editorLabels = useEditorLabels();
  const [schema, setSchema] = useState([]);
  const [isSchemaOpened, setIsSchemaOpened] = useState(openSchema);
  const [fullWidth, setFullWidth] = useState(false);

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
  const { classes, cx } = ContentEditorInputStyles(
    { editorStyles, fullWidth },
    { name: 'ContentEditorInput' }
  );

  useEffect(() => {
    if (openSchema !== isSchemaOpened) setIsSchemaOpened(openSchema);
  }, [openSchema]);

  if (isEmpty(editorLabels)) return null;

  return (
    <Box className={classes.root}>
      {useSchema && (
        <Schema
          schema={schema}
          schemaLabel={schemaLabel}
          isSchemaOpened={isSchemaOpened}
          setIsSchemaOpened={setIsSchemaOpened}
        />
      )}
      <Box className={classes.textEditorContainer}>
        <Box className={classes.widthButton}>
          <IconButton onClick={() => setFullWidth((fw) => !fw)}>
            {fullWidth ? <ShrinkIcon /> : <ExpandDiagonalIcon />}
          </IconButton>
        </Box>
        <TextEditor
          {...props}
          placeholder={placeholder}
          content={value}
          onChange={onChange}
          onSchemaChange={(json) => setSchema(json.content)}
          editorClassname={cx(classes.editor, editorClassname)}
          toolbarClassname={classes.toolbarRoot}
          editorContainerClassname={classes.editorContainer}
          acceptedTags={CONTENT_EDITOR_ACCEPTED_TAGS}
          useSchema
          toolbarPosition={'center'}
        >
          {toolbars.heading && <HeadingsTool labels={editorLabels.headingsTool} />}
          {toolbars.color && <ColorTool label={editorLabels.colorTool} />}
          {toolbars.style && <TransformsTool labels={editorLabels.transformsTool} />}
          {toolbars.align && <TextAlignTool labels={editorLabels.textAlignTool} />}
          {toolbars.list && <ListIndentTool labels={editorLabels.listIndentTool} />}
          {toolbars.formulation && <ScriptsTool labels={editorLabels.scriptsTool} />}

          <ButtonGroup>
            {toolbars.link && <LinkTool {...editorLabels.linkTool} />}
            {leemonsTools.map((item, i) =>
              React.cloneElement(item.tool, {
                key: item.tool.id || `t-${i}`,
                ...editorLabels.libraryTool,
                alignLabels: editorLabels.textAlignTool,
                openLibraryModal,
              })
            )}
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
