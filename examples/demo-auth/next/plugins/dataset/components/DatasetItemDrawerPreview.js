import React from 'react';
import { Card } from 'leemons-ui';

export const DatasetItemDrawerPreview = ({ t, item }) => {
  return (
    <>
      <div className="text-center text-sm mt-6 mb-24 text-base-content">{t('preview')}</div>
      <Card className="shadow mx-6 bg-primary-content p-6">Cartita</Card>
    </>
  );
};
