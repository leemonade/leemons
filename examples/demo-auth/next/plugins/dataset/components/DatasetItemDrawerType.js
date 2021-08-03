import React from 'react';
import { Checkbox, FormControl, Select } from 'leemons-ui';

export const DatasetItemDrawerType = ({
  t,
  tCommon,
  item,
  register,
  errors,
  onChange = () => {},
}) => {
  return (
    <>
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
                {...register('frontConfig.type', {
                  required: tCommon('required'),
                })}
              >
                <option value="text-field">{t('text_field')}</option>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className="flex flex-row">
          {/* Required */}
          <div className="ml-6">
            <FormControl label={t('required')} labelPosition="right" formError={errors.required}>
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
    </>
  );
};
