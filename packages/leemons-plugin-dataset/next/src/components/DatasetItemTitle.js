import React, { useContext } from 'react';
import * as _ from 'lodash';
import { FormControl, Input } from 'leemons-ui';
import DatasetItemDrawerContext from './DatasetItemDrawerContext';

export const DatasetItemTitle = () => {
  const { t, tCommon, item, form } = useContext(DatasetItemDrawerContext);
  return (
    <FormControl className="w-full" formError={_.get(form.errors, 'frontConfig.name')}>
      <Input
        className="mr-10 input-lg text-2xl"
        outlined={true}
        placeholder={t('new_field')}
        {...form.register('frontConfig.name', {
          required: tCommon('required'),
        })}
      />
    </FormControl>
  );
};
