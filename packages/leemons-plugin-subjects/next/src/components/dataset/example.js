import { useMemo, useState } from 'react';
import { useAsync } from '@common/useAsync';
import useTranslateLoader from '@multilanguage/useTranslateLoader';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import useRequestErrorMessage from '@common/useRequestErrorMessage';

import { getDatasetSchemaRequest, removeDatasetFieldRequest } from '@dataset/request';
import { useDatasetItemDrawer } from '@dataset/components/DatasetItemDrawer';
import getDatasetAsArrayOfProperties from '@dataset/helpers/getDatasetAsArrayOfProperties';

import prefixPN from '@families/helpers/prefixPN';

import { addErrorAlert, addSuccessAlert } from '@layout/alert';
import { Button, Modal, PageContainer, Table, useModal } from 'leemons-ui';

export default function DatasetExample() {
  // Define si se estan cargando los campos que hay en el dataset
  const [loading, setLoading] = useState(true);
  // Aqui se guarda el array de campos que hay en el dataset una vez a cargado
  const [tableItems, setTableItems] = useState([]);
  // Item del dataset que queremos actualizar
  // (Si queremos crear debera estar a null)
  const [item, setItem] = useState(null);
  // Aqui se almacena el item del dataset que vamos a borrar
  // si se acepta en la modal
  const [itemToRemove, setItemToRemove] = useState(null);
  // [0] (toggle) cierra o abre la modal del dataset
  // [1] (DatasetItemDrawer) es necesario pintarlo en el html, ya
  // que es la modal que muestra toggle
  const [toggle, DatasetItemDrawer] = useDatasetItemDrawer();
  // Sacamos traducciones necesarias
  const [t] = useTranslateLoader(prefixPN('config_page'));
  const { t: tCommonTypes } = useCommonTranslate('form_field_types');
  // [0] (error) Mensaje de error seteado en setError
  // [1] (setError) Insertar el error
  // [2] (ErrorAlert) Componente alerta ya preparada con el error para
  // pintarlo en el html (Solo se muestra si hay un error)
  // [3] (getErrorMessage) Función de ayuda que traduce ciertos tipos
  // de mensajes de error devueltos por el backend, [1] la usa internamente
  // cada vez que se le llama
  const [error, setError, ErrorAlert, getErrorMessage] = useRequestErrorMessage();
  // [0] (modal) Parametros necesarios de pasar a la componente <Modal> de leemons-ui
  // [1] (toggleModal) Modifica lo devuelto en [0] para que se muestre la modal
  const [modal, toggleModal] = useModal({
    animated: true,
    title: t('remove_modal.title'),
    message: t('remove_modal.message'),
    cancelLabel: t('remove_modal.cancel'),
    actionLabel: t('remove_modal.action'),
    // Esta funcion es llamada si pinchamos en el boton de action en la modal
    onAction: async () => {
      try {
        // Mandamos a borrar el campo del dataset
        await removeDatasetFieldRequest(`families-data`, 'plugins.families', itemToRemove.id);
        // Mostramos un alerta flotante diciendo que la acción se completado satisfactoriamente
        addSuccessAlert(t('dataset_tab.deleted_done'));
        // Recargamos los campos del dataset para que se refleje el cambio de a ver borrado un campo
        await reload();
      } catch (e) {
        // Mostramos un alerta flotante mostrando el error
        addErrorAlert(getErrorMessage(e));
      }
    },
  });

  // Se llama a esta funcion cada vez que queramos añadir un nuevo campo
  function newItem() {
    // Ponemos el item a null para que se cree un nuevo campo
    setItem(null);
    // Mostramos la modal de dataset
    toggle();
  }

  // Se llama a esta funcion cada vez que queramos actualizar un campo
  function openItem(item) {
    // Seteamos el campo que queremos editar
    setItem(item);
    // Mostramos la modal de dataset
    toggle();
  }

  // Se llama a esta funcion cada vez que queremos borrar un campo
  function removeItem(item) {
    // Seteamos el campo que queremos borrar
    setItemToRemove(item);
    // Mostramos la modal de confirmación
    toggleModal();
  }

  // La función recarga los datos del dataset volviendo a consultarlos con la bbdd
  async function reload() {
    try {
      // Marcamos como que estamos cargando los datos
      setLoading(true);
      // Pasamos lo devuelvo por load a onSuccess y si hay error llamamos a
      // onError para simular la carga de la componente
      await onSuccess(await load());
    } catch (e) {
      onError(e);
    }
  }

  // Cada vez que se guarde un nuevo item en el dataset recargamos los datos
  async function onSave(item) {
    setTableItems([...tableItems, item.schemaConfig]);
    // await reload();
  }

  // Preparamos los headers que se van a mostrar en la tabla
  const tableHeaders = useMemo(
    () => [
      {
        Header: t('dataset_tab.table.name'),
        accessor: (field) => (
          <div className="text-left">
            {field.schema.frontConfig.name} {field.schema.frontConfig.required ? '*' : ''}
          </div>
        ),
        className: 'text-left',
      },
      {
        Header: t('dataset_tab.table.description'),
        accessor: 'description',
        className: 'text-left',
      },
      {
        Header: t('dataset_tab.table.type'),
        accessor: (field) => (
          <div className="text-center">{tCommonTypes(field.schema.frontConfig.type)}</div>
        ),
        className: 'text-center',
      },
      {
        Header: t('dataset_tab.table.actions'),
        accessor: (field) => (
          <div className="text-center">
            {/* Boton de actualizar campo */}
            <Button color="primary" text onClick={() => openItem(field)}>
              {t('dataset_tab.table.edit')}
            </Button>
            {/* Boton de borrar campo */}
            <Button color="primary" text onClick={() => removeItem(field)}>
              {t('dataset_tab.table.delete')}
            </Button>
          </div>
        ),
        className: 'text-center',
      },
    ],
    [t, tCommonTypes]
  );

  // Funcion de carga, aqui tienen que ir todas las cosas asincronas
  const load = useMemo(
    () => () => getDatasetSchemaRequest(`families-data`, 'plugins.families'),
    []
  );

  // Se llama a esta funcion cuando la de carga termina y recibe lo devuelto por la funcion de carga
  const onSuccess = useMemo(
    () => ({ dataset }) => {
      // setTableItems(getDatasetAsArrayOfProperties(dataset));
      setLoading(false);
    },
    []
  );

  // Se llama a esta funcion si dentro de la de carga se da algun error
  const onError = useMemo(
    () => (e) => {
      // ES: 4001 codigo de que aun no existe schema, como es posible ignoramos el error
      if (e.code !== 4001) {
        setError(e);
      }
      setLoading(false);
    },
    []
  );

  // Es como un useEffect(() =>{}, []) pero preparado de tal forma que si el
  // componente es desmontado mientras se ejecutaba la función de carga no se llama a
  // la de onSuccess para que react no de error de que la componente no esta montada.
  useAsync(load, onSuccess, onError);

  return (
    <>
      {/* Modal de error */}
      <Modal {...modal} />
      <div className="bg-primary-content">
        <PageContainer className="pt-0">
          {/* Mensaje de error */}
          <ErrorAlert />
          {!loading && !error ? (
            <div className="pt-6 mb-6 flex flex-row justify-end items-center">
              {/* Boton de añadir nuevo campo */}
              <Button color="secondary" onClick={newItem}>
                {/* <PlusIcon className="w-6 h-6 mr-1"  /> */}
                {t('dataset_tab.add_field')}
              </Button>

              {/*
                  Modal de dataset, notese que hay que pasarle la localizacion
                  creada previamente para que añada/actualice el campo en dicha localización
                 */}
              <DatasetItemDrawer
                // locationName={`families-data`} // Si no lo pones, lo devuelve como json
                pluginName="plugins.families"
                item={item}
                onSave={onSave}
              />
            </div>
          ) : null}
        </PageContainer>
      </div>
      {!loading && !error ? (
        <PageContainer>
          <div className="bg-primary-content p-4">
            <div>
              {tableItems && tableItems.length ? (
                <>
                  {/* Tabla con los campos */}
                  <Table columns={tableHeaders} data={tableItems} />
                </>
              ) : (
                <>
                  {/* Si no hay campos para la tabla mostramos un mensaje */}
                  <div className="text-center">{t('dataset_tab.no_data_in_table')}</div>
                </>
              )}
            </div>
          </div>
        </PageContainer>
      ) : null}
    </>
  );
}
