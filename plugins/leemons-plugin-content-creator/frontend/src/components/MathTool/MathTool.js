import React, { useMemo } from 'react';
import { Button, useTextEditor } from '@bubbles-ui/editors';
import { MathExtension } from './MathExtension';
import { MathIcon } from './MathIcon';

export const MATH_TOOL_DEFAULT_PROPS = {
  label: 'Math',
};

const MathTool = ({ label, ...props }) => {
  const { editor, readOnly, toolModalOpen, currentTool } = useTextEditor();

  const handleOnClick = () => {
    editor.chain().focus().setMath().run();
  };

  const mathModalOpened = useMemo(
    () => currentTool.type === 'math' && toolModalOpen,
    [currentTool, toolModalOpen]
  );

  if (readOnly) return null;
  return (
    <>
      <Button
        {...props}
        label={label}
        icon={<MathIcon height={16} width={16} />}
        actived={mathModalOpened || editor?.isActive('math')}
        onClick={handleOnClick}
      />
    </>
  );
};
MathTool.propTypes = MATH_TOOL_DEFAULT_PROPS;
MathTool.extensions = [MathExtension];

export { MathTool };
