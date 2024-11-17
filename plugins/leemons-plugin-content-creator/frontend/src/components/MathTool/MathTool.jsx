import React from 'react';
import PropTypes from 'prop-types';
import { Button, useTextEditor } from '@bubbles-ui/editors';
import { MathExtension } from './MathExtension';
import { MathIcon } from './MathIcon';

export const MATH_TOOL_DEFAULT_PROPS = {
  label: 'Math',
};

export const MATH_TOOL_PROP_TYPES = {
  label: PropTypes.string,
};
const MathTool = ({ label, ...props }) => {
  const { editor, readOnly } = useTextEditor();

  const handleOnClick = () => {
    editor.chain().focus().setMath().run();
  };

  if (readOnly) return null;
  return (
    <>
      <Button
        {...props}
        label={label}
        icon={<MathIcon height={20} width={20} />}
        actived={editor?.isActive('math')}
        onClick={handleOnClick}
      />
    </>
  );
};
MathTool.defaultProps = MATH_TOOL_DEFAULT_PROPS;
MathTool.propTypes = MATH_TOOL_PROP_TYPES;
MathTool.extensions = [MathExtension];

export { MathTool };
