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
import DatasetItemDrawerContext from './DatasetItemDrawerContext';
import datasetDataTypes from '../helpers/datasetDataTypes';

const transformItemToSaveSchema = (item, locale) => {
  let schema = { frontConfig: item.frontConfig };
  let ui = {};

  if (item) {
    const { frontConfig, locales } = item;
    if (frontConfig) {
      // Text Field
      if (frontConfig.type === datasetDataTypes.textField.type) {
        schema.type = 'string';
        if (frontConfig.masked) {
          ui['ui:widget'] = 'password';
        }
        if (frontConfig.onlyNumbers) {
          schema.type = 'integer';
        }
      }
      // Rich Text
      if (frontConfig.type === datasetDataTypes.richText.type) {
        schema.type = 'string';
        ui['ui:widget'] = 'textarea';
      }
      // Text Field / Rich Text
      if (
        frontConfig.type === datasetDataTypes.textField.type ||
        frontConfig.type === datasetDataTypes.richText.type
      ) {
        if (item.minLength) schema.minLength = parseInt(item.minLength);
        if (item.maxLength) schema.maxLength = parseInt(item.maxLength);
      }
    }

    if (locale && locales && locales[locale]) {
      schema = { ...schema, ...locales[locale].schema };
      ui = { ...ui, ...locales[locale].ui };
    }
  }

  console.log(schema);

  return { schema, ui };
};

const DatasetItemDrawer = ({ drawer, close, item: _item }) => {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('datasetItemDrawer') });
  const t = tLoader(prefixPN('datasetItemDrawer'), translations);
  const { t: tCommon } = useCommonTranslate('forms');
  const [contextState, setContextState] = useState({});
  const [item, setItem] = useState(_item || { frontConfig: { permissions: [] } });

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
      setValue('frontConfig.name', _item.frontConfig.name);
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (err) {}
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

  return (
    <Drawer {...drawer}>
      <DatasetItemDrawerContext.Provider
        value={{
          ...contextState,
          tCommon,
          t,
          item,
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
              item={transformItemToSaveSchema(currentFormValues, contextState.currentLocale)}
            />
          </div>
          <div className="w-8/12 h-full px-10 py-4 relative">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Titulo y cerrar */}
              <div className="flex flex-row justify-between items-center mb-16">
                <DatasetItemTitle />
                <div
                  style={{ width: '18px', height: '18px' }}
                  className="relative cursor-pointer"
                  onClick={close}
                >
                  <ImageLoader src="/assets/svgs/close.svg" />
                </div>
              </div>

              {/* *** Campos *** */}
              <DatasetItemDrawerType />

              {/* *** Idiomas *** */}
              <DatasetItemSeparator text={t('config_and_languages')} />
              <DatasetItemDrawerLocales />

              {/* *** Permisos *** */}
              <DatasetItemSeparator text={t('profiles_permission')} />
              <DatasetItemDrawerPermissions onChange={onPermissionsChange} />

              <div className="absolute w-full bg-primary-content left-0 bottom-0 px-6 py-4 text-right">
                <Button color="primary" wide={true}>
                  {t('save')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DatasetItemDrawerContext.Provider>
    </Drawer>
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
      return <DatasetItemDrawer drawer={drawer} close={toggleDrawer} {...data} />;
    },
  ];
};
