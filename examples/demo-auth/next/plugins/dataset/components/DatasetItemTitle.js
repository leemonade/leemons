import React from 'react';
import { FormControl, Input } from 'leemons-ui';

export const DatasetItemTitle = ({ t, tCommon, item, register, errors }) => {
  return (
    <FormControl className="w-full" formError={errors.name}>
      <Input
        className="mr-10 input-lg text-2xl"
        outlined={true}
        placeholder={t('new_field')}
        {...register('frontConfig.name', {
          required: tCommon('required'),
        })}
      />
    </FormControl>
  );
};
