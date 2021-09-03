import { useState, useMemo } from 'react';

import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import { Button } from 'leemons-ui';
import Table from 'leemons-ui/dist/components/ui/Table';

function useArrayState(initialState) {
  const [items, setItems] = useState(initialState);

  const pushItems = (newItems) => {
    if (Array.isArray(newItems)) {
      setItems([...items, ...newItems]);
    } else {
      setItems([...items, newItems]);
    }
  };

  const removeItems = (f) => {
    setItems(items.filter((...args) => !f(...args)));
  };

  const findItems = (f) => items.filter(f);

  return [items, { setItems, pushItems, removeItems, findItems }];
}

function ActionButtons({ removeItems, setEditItem, toggle, field } = {}) {
  return (
    <div className="text-center">
      {/* Boton de actualizar campo */}
      <Button
        color="primary"
        text
        onClick={() => {
          console.log('Edit', field);
          toggle();
        }}
      >
        editar
      </Button>
      {/* Boton de borrar campo */}
      <Button
        color="primary"
        text
        onClick={() => {
          console.log('Delete', field);
          removeItems((item) => item === field);
        }}
      >
        eliminar
      </Button>
    </div>
  );
}

export default function DatasetAdmin() {
  const [items, { pushItems, removeItems, findItems }] = useArrayState([]);
  const [editItem, setEditItem] = useState(null);
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();

  const columns = useMemo(() => [
    { Header: 'Nombre', accessor: 'schema.frontConfig.name' },
    { Header: 'Descripción', accessor: 'schema.description' },
    { Header: 'Tipo', accessor: 'schema.type' },
    {
      Header: 'Acciones',
      accessor: (field) => ActionButtons({ removeItems, setEditItem, toggle, field }),
    },
  ]);

  const onSaveDatasetItem = (item) => {
    pushItems(item.schemaConfig);
    console.log(item);
  };

  console.log(items);
  return (
    <>
      <p>Dataset</p>
      <Button onClick={toggle} color="primary">
        Toggle
      </Button>
      <DatasetItemDrawer
        item={null} // El item a editar (null si nuevo)
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
    </>
  );
}
