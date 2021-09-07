import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { Button } from 'leemons-ui';
import Table from 'leemons-ui/dist/components/ui/Table';
import { useMemo, useState } from 'react';
import useArrayState from '../../hooks/useArrayState';
import ActionButtons from './actionButtons';

export default function DatasetAdmin() {
  // The dataset fields with array state helpers
  const [items, { pushItems, removeItems, findItems }] = useArrayState([]);
  // The dataset field that needs to be edited (null if new one)
  const [editItem, setEditItem] = useState(null);
  // The dataset drawer and the toggle dataset drawer
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();

  // The table columns we are going to ue (they require Memo to prevent reRender)
  const columns = useMemo(() => [
    { Header: 'Nombre', accessor: 'schemaConfig.schema.frontConfig.name' },
    { Header: 'Descripción', accessor: 'schemaConfig.schema.description' },
    { Header: 'Tipo', accessor: 'schemaConfig.schema.type' },
    {
      Header: 'Acciones',
      accessor: (field) => ActionButtons({ removeItems, setEditItem, toggle, field }),
    },
  ]);

  /*
   * Handle dataset events
   */

  // save item (not saved to server?)
  // TODO: check what we do receive when it saved to server
  const onSaveDatasetItem = (item) => {
    console.log(item);
    pushItems(item);
  };

  const onGetDataset = () => {
    console.log(items);
  };

  return (
    <>
      <Button onClick={toggle} color="primary">
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
