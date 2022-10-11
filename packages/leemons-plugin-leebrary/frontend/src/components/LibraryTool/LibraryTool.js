import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Popover } from '@bubbles-ui/components';
import { Button, useTextEditor } from '@bubbles-ui/editors';
import { LibraryExtension } from './LibraryExtension';
import { LibraryModal } from './LibraryModal';
import { LibraryIcon } from './LibraryIcon';

export const LIBRARY_TOOL_DEFAULT_PROPS = {
  label: 'Library',
};

export const LIBRARY_TOOL_PROP_TYPES = {
  label: PropTypes.string,
};

const LibraryTool = ({ label, ...props }) => {
  const { editor, readOnly, libraryModalOpened, editLibrary, closeLibraryModal, libraryContent } =
    useTextEditor();

  React.useEffect(
    () => console.log('libraryModalOpened:', libraryModalOpened),
    [libraryModalOpened]
  );

  const handleOnChange = (content) => {
    // console.log('>>> LibraryTool > onSetContent:', content);
    if (content.asset) {
      // editor?.chain().focus().extendMarkRange('library').setContent(content).run();
      editor.chain().focus().setLibrary(content).run();
    }

    closeLibraryModal();
  };

  const handleOnEdit = () => {
    const content = editor.getAttributes('library');
    // console.log('>>> LibraryTool > handleOnEdit:', content);
    editLibrary(!isEmpty(content) ? content : libraryContent);
  };

  if (readOnly) return null;

  return (
    <Popover
      opened={libraryModalOpened}
      onClose={() => console.log('LibraryModal cerrada')}
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
        ></Button>
      }
    >
      <LibraryModal
        labels={{
          width: 'Ancho',
          display: 'Mostrar como',
          align: 'Alineación',
          cancel: 'Cancelar',
          add: 'Añadir',
          update: 'Actualizar',
        }}
        placeholders={{ width: 'Introduce un ancho', display: 'Seleccionar' }}
        errorMessages={{
          width: 'Campo requerido',
          display: 'Campo requerido',
        }}
        onCancel={() => closeLibraryModal()}
        onChange={handleOnChange}
      />
    </Popover>
  );
};

LibraryTool.defaultProps = LIBRARY_TOOL_DEFAULT_PROPS;
LibraryTool.propTypes = LIBRARY_TOOL_PROP_TYPES;
LibraryTool.extensions = [LibraryExtension];

export { LibraryTool };
