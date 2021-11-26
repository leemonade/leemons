import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { Button } from 'leemons-ui';
import Table from 'leemons-ui/dist/components/ui/Table';
import { useMemo, useRef, useState } from 'react';
import useArrayState from '../../hooks/useArrayState';
import ActionButtons from './actionButtons';

export default function DatasetAdmin() {
  // The dataset fields with array state helpers
  const [items, { pushItems, removeItems, findItems, setItems }] = useArrayState([]);
  // The dataset field that needs to be edited (null if new one)
  const [editItem, setEditItem] = useState(null);
  // The dataset field index to edit
  const editItemIndex = useRef(null);
  // The dataset drawer and the toggle dataset drawer
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();

  // The table columns we are going to ue (they require Memo to prevent reRender)
  const columns = useMemo(() => [
    { Header: 'Nombre', accessor: 'schemaConfig.schema.frontConfig.name' },
    { Header: 'Descripción', accessor: 'schemaConfig.schema.description' },
    { Header: 'Tipo', accessor: 'schemaConfig.schema.type' },
    {
      Header: 'Acciones',
      accessor: (field, index) =>
        ActionButtons({
          removeItems,
          setEditItem: (item) => editItemAction(item, index),
          toggle,
          field,
        }),
    },
  ]);

  const editItemAction = (item, index) => {
    editItemIndex.current = index;
    setEditItem(item);
  };

  /*
   * Handle dataset events
   */

  // save item (not saved to server?)
  // TODO: check what we do receive when it saved to server
  const onSaveDatasetItem = (item) => {
    if (editItemIndex.current !== null) {
      items[editItemIndex.current] = item;
      editItemIndex.current = null;
      setItems(items);
    } else {
      pushItems(item);
    }
  };

  const onGetDataset = () => {
    console.log(items);
  };

  const newField = () => {
    setEditItem(null);
    toggle();
  };

  return (
    <>
      <Button onClick={newField} color="primary">
        Añadir campo
      </Button>
      <DatasetItemDrawer
        item={editItem} // El item a editar (null si nuevo)
        pluginName="plugins.classroom"
        onSave={onSaveDatasetItem}
      />

      {items.length ? (
        <Table columns={columns} data={items} />
      ) : (
        <>
          {/* Si no hay campos para la tabla mostramos un mensaje */}
          <div className="text-center">No hay datos todavía</div>
        </>
      )}
      <Button onClick={onGetDataset}>See data</Button>
    </>
  );
}
