import React from 'react';
import { Button, Checkbox, Drawer, FormControl, ImageLoader, Select, useDrawer } from 'leemons-ui';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import { useForm } from 'react-hook-form';
import useCommonTranslate from '@multilanguage/helpers/useCommonTranslate';
import prefixPN from '../helpers/prefixPN';
import { DatasetItemSeparator } from './DatasetItemSeparator';
import { DatasetItemTitle } from './DatasetItemTitle';
import { DatasetItemDrawerPreview } from './DatasetItemDrawerPreview';
import { DatasetItemDrawerPermissions } from './DatasetItemDrawerPermissions';

const DatasetItemDrawer = ({ drawer, close, item }) => {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('datasetItemDrawer') });
  const t = tLoader(prefixPN('datasetItemDrawer'), translations);
  const { t: tCommon } = useCommonTranslate('forms');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log(data);
    } catch (err) {}
  };

  return (
    <Drawer {...drawer}>
      <div className="max-w-screen-xl w-screen h-full flex flex-row">
        <div className="w-4/12 bg-base-200 h-full">
          <DatasetItemDrawerPreview t={t} />
        </div>
        <div className="w-8/12 h-full px-10 py-4">
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

            {/* Tipo de campo / Required / Masked */}
            <div className="flex flex-row">
              {/* Tipo de campo */}
              <div className="flex flex-row justify-between items-center w-7/12">
                <div className="text-sm text-secondary mr-6">{t('field_type')}</div>
                <div>
                  <FormControl formError={errors.type}>
                    <Select
                      outlined={true}
                      className="w-full max-w-xs"
                      {...register('type', {
                        required: tCommon('required'),
                      })}
                    >
                      <option>telekinesis</option>
                      <option>time travel</option>
                      <option>invisibility</option>
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="flex flex-row">
                {/* Required */}
                <div className="ml-6">
                  <FormControl
                    label={t('required')}
                    labelPosition="right"
                    formError={errors.required}
                  >
                    <Checkbox color="primary" {...register('required')} />
                  </FormControl>
                </div>
                {/* Masked */}
                <div className="ml-6">
                  <FormControl label={t('masked')} labelPosition="right" formError={errors.masked}>
                    <Checkbox color="primary" {...register('masked')} />
                  </FormControl>
                </div>
              </div>
            </div>

            {/* *** Idiomas *** */}
            <DatasetItemSeparator text={t('config_and_languages')} />

            {/* *** Permisos *** */}
            <DatasetItemSeparator text={t('profiles_permission')} />
            <DatasetItemDrawerPermissions t={t} />

            <Button className="my-8 btn-block" color="primary" rounded={true}>
              Enviar
            </Button>
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
