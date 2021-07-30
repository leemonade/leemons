import React from 'react';
import { Card, Drawer, ImageLoader, useDrawer } from 'leemons-ui';
import useTranslate from '@multilanguage/useTranslate';
import tLoader from '@multilanguage/helpers/tLoader';
import prefixPN from '../helpers/prefixPN';

const DatasetItemDrawerPreview = ({ t, item }) => {
  return (
    <>
      <div className="text-center text-sm mt-6 mb-24 text-base-content">{t('preview')}</div>
      <Card className="shadow mx-6 bg-primary-content p-6">Cartita</Card>
    </>
  );
};

const DatasetItemDrawer = ({ drawer, close, item }) => {
  const [translations] = useTranslate({ keysStartsWith: prefixPN('datasetItemDrawer') });
  const t = tLoader(prefixPN('datasetItemDrawer'), translations);

  return (
    <Drawer {...drawer}>
      <div className="max-w-screen-xl w-screen h-full flex flex-row">
        <div className="w-4/12 bg-base-200 h-full">
          <DatasetItemDrawerPreview t={t} />
        </div>
        <div className="w-8/12 h-full px-10 py-4">
          {/* Titulo y cerrar */}
          <div className="flex flex-row justify-between items-center mb-16">
            <div className="text-2xl">{t('new_field')}</div>
            <div
              style={{ width: '18px', height: '18px' }}
              className="relative cursor-pointer"
              onClick={close}
            >
              <ImageLoader src="/assets/svgs/close.svg" />
            </div>
          </div>
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
