import React from 'react';
import { Card } from 'leemons-ui';
import formWithTheme from '@common/formWithTheme';

export const DatasetItemDrawerPreview = ({ t, item }) => {
  const pName = '------------';
  const schema = {
    type: 'object',
    properties: {
      [pName]: item.schema,
    },
    required: [],
  };

  if (item.schema?.frontConfig?.required) {
    schema.required.push(pName);
  }

  const ui = {
    [pName]: item.ui,
  };

  console.log(schema);

  const Form = formWithTheme(schema, ui, []);

  let data = null;

  return (
    <>
      <div className="text-center text-sm mt-6 mb-24 text-base-content">{t('preview')}</div>
      <Card className="shadow mx-6 bg-primary-content p-6">
        <Form formData={data} />
      </Card>
    </>
  );
};
