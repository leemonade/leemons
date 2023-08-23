import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { keys } from 'lodash';
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

const TextEditorViewer = ({ children, ...props }) => {
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
  }, [textEditorTools]);

  // ··································································
  // STYLES

  return (
    <TextEditor {...props} content={children} readOnly>
      <ColorTool />
      <TransformsTool />
      <LinkTool />
      <HeadingsTool paragraph={false} />
      <ListIndentTool />
      <TextAlignTool />
      <ScriptsTool />

      {leemonsTools.map((item, i) => (
        <React.Fragment key={item.tool.id || `t-${i}`}>{item.tool}</React.Fragment>
      ))}
    </TextEditor>
  );
};

TextEditorViewer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Object)]),
};

// eslint-disable-next-line import/prefer-default-export
export { TextEditorViewer };
