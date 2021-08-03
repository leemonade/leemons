import React from 'react';
import { Card } from 'leemons-ui';
import applyRules from 'react-jsonschema-form-conditionals';
import Engine from 'json-rules-engine-simplified';
import formWithTheme from '@common/formWithTheme';

export const DatasetItemDrawerPreview = ({ t, item }) => {
  const Form = formWithTheme();
  const FormWithConditionals = applyRules(item.schema, item.ui, [], Engine)(Form);

  return (
    <>
      <div className="text-center text-sm mt-6 mb-24 text-base-content">{t('preview')}</div>
      <Card className="shadow mx-6 bg-primary-content p-6">
        <FormWithConditionals formData={''} />
      </Card>
    </>
  );
};
