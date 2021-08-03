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

const transformItemToSaveSchema = (item) => {
  const schema = {};
  const ui = {};

  console.log(item);

  if (item) {
    if (item.frontConfig) {
      if (item.frontConfig.type === 'text-field') {
        schema.type = 'string';
      }
    }
  }

  return { schema, ui };
};

const DatasetItemDrawer = ({ drawer, close, item: _item }) => {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('datasetItemDrawer') });
  const t = tLoader(prefixPN('datasetItemDrawer'), translations);
  const { t: tCommon } = useCommonTranslate('forms');
  const [item, setItem] = useState(_item || { frontConfig: { permissions: [] } });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm();

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
      <div className="max-w-screen-xl w-screen h-full flex flex-row">
        <div className="w-4/12 bg-base-200 h-full">
          <DatasetItemDrawerPreview t={t} item={transformItemToSaveSchema(getValues())} />
        </div>
        <div className="w-8/12 h-full px-10 py-4 relative">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Titulo y cerrar */}
            <div className="flex flex-row justify-between items-center mb-16">
              <DatasetItemTitle
                t={t}
                tCommon={tCommon}
                item={item}
                register={register}
                errors={errors}
              />
              <div
                style={{ width: '18px', height: '18px' }}
                className="relative cursor-pointer"
                onClick={close}
              >
                <ImageLoader src="/assets/svgs/close.svg" />
              </div>
            </div>

            {/* *** Campos *** */}
            <DatasetItemDrawerType
              t={t}
              tCommon={tCommon}
              register={register}
              errors={errors}
              item={item}
            />

            {/* *** Idiomas *** */}
            <DatasetItemSeparator text={t('config_and_languages')} />
            <DatasetItemDrawerLocales
              t={t}
              tCommon={tCommon}
              register={register}
              errors={errors}
              setValue={setValue}
              getValues={getValues}
              item={item}
            />

            {/* *** Permisos *** */}
            <DatasetItemSeparator text={t('profiles_permission')} />
            <DatasetItemDrawerPermissions t={t} item={item} onChange={onPermissionsChange} />

            <div className="absolute w-full bg-primary-content left-0 bottom-0 px-6 py-4 text-right">
              <Button color="primary" wide={true}>
                {t('save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
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
