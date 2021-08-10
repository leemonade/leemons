import * as _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { Button, Drawer, ImageLoader, useDrawer } from 'leemons-ui';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { useForm } from 'react-hook-form';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import update from 'immutability-helper';
import prefixPN from '../helpers/prefixPN';
import { DatasetItemSeparator } from './DatasetItemSeparator';
import { DatasetItemTitle } from './DatasetItemTitle';
import { DatasetItemDrawerPreview } from './DatasetItemDrawerPreview';
import { DatasetItemDrawerPermissions } from './DatasetItemDrawerPermissions';
import { DatasetItemDrawerLocales } from './DatasetItemDrawerLocales';
import { DatasetItemDrawerType } from './DatasetItemDrawerType';
import {
  DatasetItemDrawerCentersContext,
  DatasetItemDrawerContext,
  DatasetItemDrawerProfilesContext,
} from './DatasetItemDrawerContext';
import { DatasetItemDrawerCenters } from './DatasetItemDrawerCenters';
import SimpleBar from 'simplebar-react';
import transformItemToSchemaAndUi from './help/transformItemToSchemaAndUi';
import { saveDatasetFieldRequest } from '../request';
import datasetFields from '../helpers/datasetFields';

const DatasetItemDrawer = ({ close, item: _item, locationName, pluginName, onSave = () => {} }) => {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('datasetItemDrawer') });
  const t = tLoader(prefixPN('datasetItemDrawer'), translations);
  const { t: tCommon } = useCommonTranslate('forms');
  const [saveLoading, setSaveLoading] = useState(false);
  const [contextState, setContextState] = useState({});
  const [profileContextState, setProfileContextState] = useState({});
  const [centersContextState, setCentersContextState] = useState({});
  const [item, setItem] = useState(
    _item
      ? {
          frontConfig: {
            permissions: _item.schema.frontConfig.permissions,
            centers: _item.schema.frontConfig.centers,
            isAllCenterMode: _item.schema.frontConfig.isAllCenterMode,
          },
          id: _item.id,
        }
      : { frontConfig: { permissions: [] } }
  );

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm();

  const currentFormValues = watch();

  useEffect(() => {
    if (_item) {
      setValue('frontConfig.name', _item.schema.frontConfig.name);
      _.forIn(_item.schema.frontConfig, (value, key) => {
        setValue(`frontConfig.${key}`, value);
      });
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      // ES: Datos principales para crear/actualizar el schema
      const schemaWithAllConfig = transformItemToSchemaAndUi(data, Object.keys(data.locales)[0]);
      schemaWithAllConfig.schema.frontConfig = {
        ...schemaWithAllConfig.schema.frontConfig,
        ...item.frontConfig,
      };
      // ES: Datos secundarios traducciones
      const schemaLocales = {};
      _.forIn(data.locales, (value, key) => {
        schemaLocales[key] = transformItemToSchemaAndUi(data, key);
        const schemaGoodKeys = {};
        _.forIn(schemaLocales[key].schema, (value, key) => {
          if (datasetFields.schema.indexOf(key) >= 0) {
            schemaGoodKeys[key] = value;
          }
        });
        schemaLocales[key].schema = schemaGoodKeys;
        const uiGoodKeys = {};
        _.forIn(schemaLocales[key].ui, (value, key) => {
          if (datasetFields.ui.indexOf(key) >= 0) {
            uiGoodKeys[key] = value;
          }
        });
        schemaLocales[key].ui = uiGoodKeys;
      });
      // ES: Calculamos los permisos finales
      const permissions = {
        // ES: Si esta marcado como que los permisos afecten a todos los centros decimos que las ids
        // son de tipo perfil, si solo afecta a unos centros en concreto es rol por que se almacenaran
        // las ids de los roles que sean la interseccion de centro - perfil
        permissionsType: schemaWithAllConfig.schema.frontConfig.isAllCenterMode
          ? 'profile'
          : 'role',
        permissions: {},
      };
      if (schemaWithAllConfig.schema.frontConfig.permissions) {
        if (permissions.permissionsType === 'profile') {
          _.forEach(schemaWithAllConfig.schema.frontConfig.permissions, ({ id, view, edit }) => {
            permissions.permissions[id] = [];
            if (view) permissions.permissions[id].push('view');
            if (edit) permissions.permissions[id].push('edit');
          });
        } else {
          const oneOfCentersHasRole = (role) => {
            const selectedCenters = _.filter(
              centersContextState.centers,
              ({ id }) => schemaWithAllConfig.schema.frontConfig.centers.indexOf(id) >= 0
            );
            let hasRole = false;
            _.forEach(selectedCenters, ({ roles }) => {
              _.forEach(roles, ({ id }) => {
                if (id === role) {
                  hasRole = true;
                  return false;
                }
              });
              if (hasRole) return false;
            });
            return hasRole;
          };
          _.forEach(
            schemaWithAllConfig.schema.frontConfig.permissions,
            ({ id, view, edit, roles }) => {
              _.forEach(roles, (role) => {
                if (oneOfCentersHasRole(role.id)) {
                  permissions.permissions[role.id] = [];
                  if (view) permissions.permissions[role.id].push('view');
                  if (edit) permissions.permissions[role.id].push('edit');
                }
              });
            }
          );
        }
      }

      schemaWithAllConfig.schema = { ...schemaWithAllConfig.schema, ...permissions };

      if (_item && _item.id) {
        schemaWithAllConfig.schema.id = _item.id;
      }

      if (locationName && pluginName) {
        try {
          setSaveLoading(true);
          const dataset = await saveDatasetFieldRequest(
            locationName,
            pluginName,
            schemaWithAllConfig,
            schemaLocales
          );
          setSaveLoading(false);
          onSave(dataset);
        } catch (e) {
          setSaveLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onPermissionsChange = (event) => {
    setItem(
      update(item, {
        frontConfig: {
          permissions: {
            $set: event,
          },
        },
      })
    );
  };

  const onCentersChange = (event) => {
    console.log(event);
    setItem(
      update(item, {
        frontConfig: {
          $merge: event,
        },
      })
    );
  };

  return (
    <DatasetItemDrawerProfilesContext.Provider
      value={{
        ...profileContextState,
        setState: (data) => setProfileContextState({ ...profileContextState, ...data }),
      }}
    >
      <DatasetItemDrawerCentersContext.Provider
        value={{
          ...centersContextState,
          setState: (data) => setCentersContextState({ ...centersContextState, ...data }),
        }}
      >
        <DatasetItemDrawerContext.Provider
          value={{
            ...contextState,
            tCommon,
            t,
            item,
            locationName,
            pluginName,
            form: {
              register,
              handleSubmit,
              setValue,
              getValues,
              watch,
              errors,
            },
            setState: (data) => setContextState({ ...contextState, ...data }),
          }}
        >
          <div className="max-w-screen-xl w-screen h-full flex flex-row">
            <div className="w-4/12 bg-base-200 h-full">
              <DatasetItemDrawerPreview
                t={t}
                item={transformItemToSchemaAndUi(currentFormValues, contextState.currentLocale)}
              />
            </div>
            <form
              className="w-8/12 h-full relative flex flex-col"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Titulo y cerrar */}
              <div className="flex flex-row justify-between items-center mb-8 pt-4 px-10">
                <DatasetItemTitle />
                <div
                  style={{ width: '18px', height: '18px' }}
                  className="relative cursor-pointer"
                  onClick={close}
                >
                  <ImageLoader src="/assets/svgs/close.svg" />
                </div>
              </div>

              <SimpleBar className="flex-grow h-px">
                <div className="px-10 py-1">
                  {/* *** Centros *** */}
                  <div className="mb-6">
                    <DatasetItemDrawerCenters onChange={onCentersChange} />
                  </div>

                  {/* *** Campos *** */}
                  <DatasetItemDrawerType />

                  {/* *** Idiomas *** */}
                  <DatasetItemSeparator text={t('config_and_languages')} />
                  <DatasetItemDrawerLocales />

                  {/* *** Permisos *** */}
                  <DatasetItemSeparator text={t('profiles_permission')} />
                  <DatasetItemDrawerPermissions onChange={onPermissionsChange} />
                </div>
              </SimpleBar>

              <div className="w-full bg-primary-content px-10 py-4 text-right">
                <Button color="primary" loading={saveLoading} wide={true}>
                  {t('save')}
                </Button>
              </div>
            </form>
          </div>
        </DatasetItemDrawerContext.Provider>
      </DatasetItemDrawerCentersContext.Provider>
    </DatasetItemDrawerProfilesContext.Provider>
  );
};

export const useDatasetItemDrawer = () => {
  const [drawer, toggleDrawer] = useDrawer({
    animated: true,
    side: 'right',
  });

  return [
    toggleDrawer,
    function (data) {
      return (
        <Drawer {...drawer}>
          <DatasetItemDrawer close={toggleDrawer} {...data} />
        </Drawer>
      );
    },
  ];
};
