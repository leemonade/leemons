import React, { useMemo } from 'react';
import { Card } from 'leemons-ui';
import formWithTheme from '@common/formWithTheme';

export const DatasetItemDrawerPreview = ({ t, item }) => {
  const pName = '------------';
  const schema = useMemo(() => {
    const response = {
      type: 'object',
      properties: {
        [pName]: item.schema,
      },
      required: [],
    };
    if (item.schema?.frontConfig?.required) {
      response.required.push(pName);
    }
    return response;
  }, [item]);

  const ui = useMemo(() => {
    return {
      [pName]: item.ui,
    };
  }, [item]);

  let data = null;
  const props = useMemo(() => ({ formData: data }), [data]);

  const [form] = formWithTheme(schema, ui, undefined, props);

  return (
    <>
      <div className="text-center text-sm mt-6 mb-24 text-base-content">{t('preview')}</div>
      <Card className="shadow mx-6 bg-primary-content p-6">{form}</Card>
    </>
  );
};
