import React from 'react';

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
import { ExpandDiagonalIcon, ShrinkIcon } from '@bubbles-ui/icons/outline';

import { useContentEditorStore } from '../../context/ContentEditorInput.context';

import {
  TEXTEDITOR_CONTENT_DEFAULT_PROPS,
  TEXTEDITOR_CONTENT_PROP_TYPES,
} from './TextEditorContent.constants';
import { TextEditorContentStyles } from './TextEditorContent.styles';

const CONTENT_EDITOR_ACCEPTED_TAGS = [{ type: 'library', updateWithoutContent: true }];

const TextEditorContent = ({
  editorStyles,
  toolbars,
  leemonsTools,
  children,
  placeholder,
  value,
  onChange,
  useSchema,
  editorClassname,
  toolbarPortal,
  editorLabels,
  openLibraryModal,
  canExpand,
  compact,
  fullWidth: _fullWidth,
  ref,
  ...props
}) => {
  const setSchema = useContentEditorStore((state) => state.setSchema);
  const [fullWidth, setFullWidth] = React.useState(_fullWidth);

  const { classes, cx } = TextEditorContentStyles(
    { editorStyles, fullWidth, compact },
    { name: 'TextEditorContent' }
  );
  return (
    <>
      {canExpand && (
        <Box className={classes.expandButton}>
          <IconButton onClick={() => setFullWidth((fw) => !fw)}>
            {fullWidth ? <ShrinkIcon /> : <ExpandDiagonalIcon />}
          </IconButton>
        </Box>
      )}

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
        useSchema={useSchema}
        toolbarPortal={toolbarPortal}
        ref={ref}
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
              ...item.tool.props,
              ...editorLabels.libraryTool,
              alignLabels: editorLabels.textAlignTool,
              openLibraryModal,
            })
          )}
        </ButtonGroup>
        {children}
      </TextEditor>
    </>
  );
};

TextEditorContent.defaultProps = TEXTEDITOR_CONTENT_DEFAULT_PROPS;
TextEditorContent.propTypes = TEXTEDITOR_CONTENT_PROP_TYPES;

export { TextEditorContent };
