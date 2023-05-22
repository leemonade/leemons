import React, { useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Popover } from '@bubbles-ui/components';
import { Button, useTextEditor } from '@bubbles-ui/editors';
import { LibraryExtension } from './LibraryExtension';
import { LibraryModal } from './LibraryModal';
import { LibraryIcon } from './LibraryIcon';
import { LibraryBubbleMenu } from './LibraryBubbleMenu';

export const LIBRARY_TOOL_DEFAULT_PROPS = {
  label: 'Library',
  labels: {},
  placeholders: {},
  errorMessages: {},
  bubbleMenu: {},
  alignLabels: {},
  openLibraryModal: true,
};

export const LIBRARY_TOOL_PROP_TYPES = {
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
    library: PropTypes.string,
    twoColumns: PropTypes.string,
    fullWidth: PropTypes.string,
  }),
  alignLabels: PropTypes.shape({
    left: PropTypes.string,
    center: PropTypes.string,
    justify: PropTypes.string,
    right: PropTypes.string,
  }),
  openLibraryModal: PropTypes.bool,
};

const LibraryTool = ({
  label,
  labels,
  placeholders,
  errorMessages,
  bubbleMenu,
  alignLabels,
  openLibraryModal,
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
    // console.log('>>> LibraryTool > onSetContent:', content);
    if (content.asset) {
      // editor?.chain().focus().extendMarkRange('library').setContent(content).run();
      editor.chain().focus().setLibrary(content).run();
    }

    closeToolModal();
  };

  const handleOnEdit = () => {
    const content = editor.getAttributes('library');
    // console.log('>>> LibraryTool > handleOnEdit:', content);
    editToolData(
      'library',
      !isEmpty(content) ? content : currentTool.data,
      !isEmpty(content.asset),
      <LibraryBubbleMenu
        editor={editor}
        handleOnChange={handleOnChange}
        labels={labels}
        alignLabels={alignLabels}
        bubbleMenu={bubbleMenu}
      />
    );
  };

  const libraryModalOpened = useMemo(
    () => currentTool.type === 'library' && toolModalOpen,
    [currentTool, toolModalOpen]
  );

  useEffect(() => {
    if (editor.isActive('library')) {
      const content = editor.getAttributes('library');
      const data = !isEmpty(content) ? content : currentTool.data;
      const editing = !isEmpty(content.asset);
      openBubbleMenu(
        'library',
        data,
        editing,
        <LibraryBubbleMenu
          editor={editor}
          handleOnChange={handleOnChange}
          labels={labels}
          alignLabels={alignLabels}
          bubbleMenu={bubbleMenu}
        />,
        { offset: [0, -40] }
      );
    } else {
      closeBubbleMenu();
      closeToolModal();
    }
  }, [editor.isActive('library')]);

  if (readOnly) return null;
  return (
    <Popover
      opened={libraryModalOpened}
      onClose={() => {}}
      width={360}
      position="bottom"
      placement="start"
      target={
        <Button
          {...props}
          label={label}
          icon={<LibraryIcon height={16} width={16} />}
          actived={libraryModalOpened || editor?.isActive('library')}
          onClick={handleOnEdit}
        />
      }
      zIndex={10}
    >
      <LibraryModal
        labels={labels}
        placeholders={placeholders}
        errorMessages={errorMessages}
        onCancel={() => closeToolModal()}
        onChange={handleOnChange}
        openLibraryModal={openLibraryModal}
        readOnly={readOnly}
      />
    </Popover>
  );
};

LibraryTool.defaultProps = LIBRARY_TOOL_DEFAULT_PROPS;
LibraryTool.propTypes = LIBRARY_TOOL_PROP_TYPES;
LibraryTool.extensions = [LibraryExtension];

export { LibraryTool };
