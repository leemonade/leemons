import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Popover } from '@bubbles-ui/components';
import { Button, useTextEditor } from '@bubbles-ui/editors';
import { MathExtension } from './MathExtension';
import { MathModal } from './MathModal';
import { MathIcon } from './MathIcon';
import { MathBubbleMenu } from './MathBubbleMenu';

export const MATH_TOOL_DEFAULT_PROPS = {
  label: 'Math',
  labels: {},
  placeholders: {},
  errorMessages: {},
  bubbleMenu: {},
  alignLabels: {},
  openMathModal: true,
};

export const MATH_TOOL_PROP_TYPES = {
  label: PropTypes.string,
  labels: PropTypes.shape({
    width: PropTypes.string,
    display: PropTypes.string,
    align: PropTypes.string,
    cancel: PropTypes.string,
    add: PropTypes.string,
    update: PropTypes.string,
  }),
  placeholders: PropTypes.shape({
    width: PropTypes.string,
    display: PropTypes.string,
  }),
  errorMessages: PropTypes.shape({
    width: PropTypes.string,
    display: PropTypes.string,
  }),
  bubbleMenu: PropTypes.shape({
    remove: PropTypes.string,
    math: PropTypes.string,
    twoColumns: PropTypes.string,
    fullWidth: PropTypes.string,
  }),
  alignLabels: PropTypes.shape({
    left: PropTypes.string,
    center: PropTypes.string,
    justify: PropTypes.string,
    right: PropTypes.string,
  }),
  openMathModal: PropTypes.bool,
};

const MathTool = ({
  label,
  labels,
  placeholders,
  errorMessages,
  bubbleMenu,
  alignLabels,
  openMathModal,
  ...props
}) => {
  const {
    editor,
    readOnly,
    toolModalOpen,
    currentTool,
    openBubbleMenu,
    closeBubbleMenu,
    editToolData,
    closeToolModal,
  } = useTextEditor();

  const handleOnChange = (content) => {
    // console.log('>>> MathTool > onSetContent:', content);
    if (content.asset) {
      // editor?.chain().focus().extendMarkRange('Math').setContent(content).run();
      editor.chain().focus().setMath(content).run();
    }

    closeToolModal();
  };

  const handleOnEdit = () => {
    const content = editor.getAttributes('math');
    editToolData(
      'math',
      !isEmpty(content) ? content : currentTool.data,
      !isEmpty(content.asset),
      <MathBubbleMenu
        editor={editor}
        handleOnChange={handleOnChange}
        labels={labels}
        alignLabels={alignLabels}
        bubbleMenu={bubbleMenu}
      />
    );
  };

  const mathModalOpened = useMemo(
    () => currentTool.type === 'math' && toolModalOpen,
    [currentTool, toolModalOpen]
  );

  useEffect(() => {
    if (editor.isActive('math')) {
      const content = editor.getAttributes('math');
      const data = !isEmpty(content) ? content : currentTool.data;
      const editing = !isEmpty(content.asset);
      openBubbleMenu(
        'math',
        data,
        editing,
        <MathBubbleMenu
          editor={editor}
          handleOnChange={handleOnChange}
          labels={labels}
          alignLabels={alignLabels}
          bubbleMenu={bubbleMenu}
        />
        // { offset: [0, -40] }
      );
    } else {
      closeBubbleMenu();
      closeToolModal();
    }
  }, [editor.isActive('math')]);

  if (readOnly) return null;
  return (
    <Popover
      opened={mathModalOpened}
      onClose={() => {}}
      width={360}
      position="bottom"
      placement="start"
      target={
        <Button
          {...props}
          label={label}
          icon={<MathIcon height={16} width={16} />}
          actived={mathModalOpened || editor?.isActive('math')}
          onClick={handleOnEdit}
        />
      }
      zIndex={10}
    >
      <MathModal />
    </Popover>
  );
};

MathTool.defaultProps = MATH_TOOL_DEFAULT_PROPS;
MathTool.propTypes = MATH_TOOL_PROP_TYPES;
MathTool.extensions = [MathExtension];

export { MathTool };
